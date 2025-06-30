from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.review import Review

reviews_bp = Blueprint('reviews', __name__, url_prefix='/reviews')

@reviews_bp.route('', methods=['POST'])
@jwt_required()
def add_review():
    data = request.get_json()
    user_id = get_jwt_identity()
    review = Review(
        content=data['content'],
        rating=data['rating'],
        vendor_id=data['vendor_id'],
        user_id=user_id
    )
    db.session.add(review)
    db.session.commit()
    return jsonify({'message': 'Review added', 'id': review.id}), 201

@reviews_bp.route('/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    review = Review.query.get_or_404(review_id)
    data = request.get_json()
    review.content = data.get('content', review.content)
    review.rating = data.get('rating', review.rating)
    db.session.commit()
    return jsonify({'message': 'Review updated'}), 200

@reviews_bp.route('/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    review = Review.query.get_or_404(review_id)
    db.session.delete(review)
    db.session.commit()
    return jsonify({'message': 'Review deleted'}), 200
