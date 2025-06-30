from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from backend.models import db, User, Vendor, Review
from flask_cors import cross_origin
from marshmallow import Schema, fields, ValidationError

api_blueprint = Blueprint('api', __name__)

# Schemas for input validation
class RegisterSchema(Schema):
    username = fields.Str(required=True)
    email = fields.Email(required=True)
    password = fields.Str(required=True, validate=lambda p: len(p) >= 6)

class LoginSchema(Schema):
    username = fields.Str(required=True)
    password = fields.Str(required=True)

class VendorSchema(Schema):
    name = fields.Str(required=True)
    description = fields.Str()
    location = fields.Str()

class ReviewSchema(Schema):
    rating = fields.Int(required=True, validate=lambda r: 1 <= r <= 5)
    comment = fields.Str()
    vendor_id = fields.Int(required=True)

def validate_input(schema, data):
    try:
        validated_data = schema.load(data)
        return validated_data, None
    except ValidationError as err:
        return None, err.messages

# User registration
@api_blueprint.route('/register', methods=['POST'])
@cross_origin()
def register():
    import traceback
    data = request.get_json()
    validated_data, errors = validate_input(RegisterSchema(), data)
    if errors:
        return jsonify({'errors': errors}), 400

    username = validated_data['username']
    email = validated_data['email']
    password = validated_data['password']

    try:
        if User.query.filter((User.username == username) | (User.email == email)).first():
            return jsonify({'message': 'User with that username or email already exists'}), 400

        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        return jsonify({'message': 'User created successfully'}), 201
    except Exception as e:
        tb = traceback.format_exc()
        return jsonify({'message': 'Internal server error', 'error': str(e), 'traceback': tb}), 500

# User login
@api_blueprint.route('/login', methods=['POST'])
@cross_origin()
def login():
    data = request.get_json()
    validated_data, errors = validate_input(LoginSchema(), data)
    if errors:
        return jsonify({'errors': errors}), 400

    username = validated_data['username']
    password = validated_data['password']

    user = User.query.filter_by(username=username).first()
    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify({'access_token': access_token}), 200
    else:
        return jsonify({'message': 'Invalid username or password'}), 401

# List vendors
@api_blueprint.route('/vendors', methods=['GET'])
@jwt_required()
@cross_origin()
def list_vendors():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)

    pagination = Vendor.query.paginate(page=page, per_page=per_page, error_out=False)
    vendors = pagination.items

    result = []
    for vendor in vendors:
        result.append({
            'id': vendor.id,
            'name': vendor.name,
            'description': vendor.description,
            'location': vendor.location,
            'user_id': vendor.user_id
        })

    return jsonify({
        'vendors': result,
        'total': pagination.total,
        'page': pagination.page,
        'per_page': pagination.per_page,
        'pages': pagination.pages
    }), 200

# Add vendor
@api_blueprint.route('/vendors', methods=['POST'])
@jwt_required()
@cross_origin()
def add_vendor():
    data = request.get_json()
    validated_data, errors = validate_input(VendorSchema(), data)
    if errors:
        return jsonify({'errors': errors}), 400

    current_user_id = get_jwt_identity()
    name = validated_data.get('name')
    description = validated_data.get('description')
    location = validated_data.get('location')

    vendor = Vendor(name=name, description=description, location=location, user_id=current_user_id)
    db.session.add(vendor)
    db.session.commit()

    return jsonify({'message': 'Vendor added', 'vendor_id': vendor.id}), 201

# Vendor detail
@api_blueprint.route('/vendors/<int:id>', methods=['GET'])
@jwt_required()
@cross_origin()
def vendor_detail(id):
    vendor = Vendor.query.get_or_404(id)
    reviews = []
    for review in vendor.reviews:
        reviews.append({
            'id': review.id,
            'rating': review.rating,
            'comment': review.comment,
            'user_id': review.user_id
        })
    result = {
        'id': vendor.id,
        'name': vendor.name,
        'description': vendor.description,
        'location': vendor.location,
        'user_id': vendor.user_id,
        'reviews': reviews
    }
    return jsonify(result), 200

# Update vendor
@api_blueprint.route('/vendors/<int:id>', methods=['PUT'])
@jwt_required()
@cross_origin()
def update_vendor(id):
    vendor = Vendor.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    if vendor.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    validated_data, errors = validate_input(VendorSchema(), data)
    if errors:
        return jsonify({'errors': errors}), 400

    vendor.name = validated_data.get('name', vendor.name)
    vendor.description = validated_data.get('description', vendor.description)
    vendor.location = validated_data.get('location', vendor.location)

    db.session.commit()
    return jsonify({'message': 'Vendor updated'}), 200

# Delete vendor
@api_blueprint.route('/vendors/<int:id>', methods=['DELETE'])
@jwt_required()
@cross_origin()
def delete_vendor(id):
    vendor = Vendor.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    if vendor.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(vendor)
    db.session.commit()
    return jsonify({'message': 'Vendor deleted'}), 200

# Add review
@api_blueprint.route('/reviews', methods=['POST'])
@jwt_required()
@cross_origin()
def add_review():
    data = request.get_json()
    validated_data, errors = validate_input(ReviewSchema(), data)
    if errors:
        return jsonify({'errors': errors}), 400

    current_user_id = get_jwt_identity()
    rating = validated_data.get('rating')
    comment = validated_data.get('comment')
    vendor_id = validated_data.get('vendor_id')

    vendor = Vendor.query.get(vendor_id)
    if not vendor:
        return jsonify({'message': 'Vendor not found'}), 404

    review = Review(rating=rating, comment=comment, user_id=current_user_id, vendor_id=vendor_id)
    db.session.add(review)
    db.session.commit()

    return jsonify({'message': 'Review added', 'review_id': review.id}), 201

# Update review
@api_blueprint.route('/reviews/<int:id>', methods=['PUT'])
@jwt_required()
@cross_origin()
def update_review(id):
    review = Review.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    if review.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    data = request.get_json()
    validated_data, errors = validate_input(ReviewSchema(), data)
    if errors:
        return jsonify({'errors': errors}), 400

    review.rating = validated_data.get('rating', review.rating)
    review.comment = validated_data.get('comment', review.comment)

    db.session.commit()
    return jsonify({'message': 'Review updated'}), 200

# Delete review
@api_blueprint.route('/reviews/<int:id>', methods=['DELETE'])
@jwt_required()
@cross_origin()
def delete_review(id):
    review = Review.query.get_or_404(id)
    current_user_id = get_jwt_identity()
    if review.user_id != current_user_id:
        return jsonify({'message': 'Unauthorized'}), 403

    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted'}), 200
