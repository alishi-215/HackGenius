import os
from flask import Blueprint, jsonify, request
from models import db, Tool, Category

api_bp = Blueprint('api', __name__)

@api_bp.route('/tools', methods=['GET'])
def get_tools():
    tools = Tool.query.all()
    return jsonify([tool.to_dict() for tool in tools])

@api_bp.route('/tools/<category_name>', methods=['GET'])
def get_tools_by_category(category_name):
    # Case insensitive search for category
    category = Category.query.filter(Category.name.ilike(category_name)).first()
    if not category:
        return jsonify({'error': 'Category not found'}), 404
    
    tools = Tool.query.filter_by(category_id=category.id).all()
    return jsonify([tool.to_dict() for tool in tools])

@api_bp.route('/tools/<int:tool_id>', methods=['GET'])
def get_tool_detail(tool_id):
    tool = Tool.query.get_or_404(tool_id)
    return jsonify(tool.to_dict())

def is_safe_prompt(query):
    """
    Basic AI Safety Filter
    Returns False if query contains malicious intent keywords.
    """
    forbidden_keywords = [
        "hack facebook", "hack instagram", "steal credit card", 
        "ransomware", "create virus", "exploit bank", "dark web",
        "steal password", "hack wifi neighbor"
    ]
    query_lower = query.lower()
    for kw in forbidden_keywords:
        if kw in query_lower:
            return False
    return True

@api_bp.route('/chat', methods=['POST'])
def chat_assistant():
    data = request.json
    user_query = data.get('query', '')
    persona = data.get('persona', 'neutral')
    
    if not user_query:
        return jsonify({'response': "Please ask a question."})

    # AI Safety Check
    if not is_safe_prompt(user_query):
        return jsonify({
            'response': "I cannot assist with that request. HackGenius is an ethical hacking tool guide and does not support malicious activities."
        })

    try:
        # Lazy load the brain
        from brain import Brain
        brain = Brain()
        
        # Get RAG response
        response_text = brain.get_recommendation(user_query, persona)
        
        return jsonify({'response': response_text})
    except Exception as e:
        print(f"Brain Error: {e}")
        return jsonify({'response': "I'm having trouble thinking right now. Please ensure the backend has the model downloader."}), 500
