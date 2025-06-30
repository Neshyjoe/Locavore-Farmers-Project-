from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from database import db
from models.vendor import Vendor

vendors_bp = Blueprint('vendors', __name__, url_prefix='/vendors')

@vendors_bp.route('', methods=['GET'])
@jwt_required()
def list_vendors():
    vendors = Vendor.query.all()
    return jsonify([{
        'id': v.id,
        'name': v.name,
        'location': v.location,
        'description': v.description,
        'owner_id': v.owner_id
    } for v in vendors]), 200

@vendors_bp.route('', methods=['POST'])
@jwt_required()
def create_vendor():
    data = request.get_json()
    user_id = get_jwt_identity()

    vendor = Vendor(
        name=data['name'],
        location=data['location'],
        description=data.get('description'),
        owner_id=user_id
    )
    db.session.add(vendor)
    db.session.commit()

    return jsonify({'message': 'Vendor created', 'id': vendor.id}), 201

@vendors_bp.route('/<int:vendor_id>', methods=['GET'])
@jwt_required()
def vendor_detail(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    return jsonify({
        'id': vendor.id,
        'name': vendor.name,
        'location': vendor.location,
        'description': vendor.description,
        'owner_id': vendor.owner_id
    }), 200

@vendors_bp.route('/<int:vendor_id>', methods=['PUT'])
@jwt_required()
def update_vendor(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    data = request.get_json()
    vendor.name = data.get('name', vendor.name)
    vendor.location = data.get('location', vendor.location)
    vendor.description = data.get('description', vendor.description)
    db.session.commit()
    return jsonify({'message': 'Vendor updated'}), 200

@vendors_bp.route('/<int:vendor_id>', methods=['DELETE'])
@jwt_required()
def delete_vendor(vendor_id):
    vendor = Vendor.query.get_or_404(vendor_id)
    db.session.delete(vendor)
    db.session.commit()
    return jsonify({'message': 'Vendor deleted'}), 200
