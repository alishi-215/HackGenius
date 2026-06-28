from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Category(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False, unique=True)
    description = db.Column(db.String(255))
    tools = db.relationship('Tool', backref='category', lazy=True)

    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description
        }

class Tool(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category_id = db.Column(db.Integer, db.ForeignKey('category.id'), nullable=False)
    command_usage = db.Column(db.Text)
    complexity = db.Column(db.String(20))  # Low, Medium, High
    license = db.Column(db.String(50))     # Open Source, Commercial
    performance_notes = db.Column(db.Text)

    def to_dict(self):
        data = {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'category': self.category.name,
            'command_usage': self.command_usage,
            'complexity': self.complexity,
            'license': self.license,
            'performance_notes': self.performance_notes,
            'usage_examples': [u.example_cmd for u in self.usage_examples],
            'metrics': self.metrics.to_dict() if self.metrics else None
        }
        return data

class PerformanceMetrics(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tool_id = db.Column(db.Integer, db.ForeignKey('tool.id'), nullable=False)
    tool = db.relationship('Tool', backref=db.backref('metrics', uselist=False, cascade="all, delete-orphan"))
    
    ease_of_use = db.Column(db.String(50))
    depth_of_analysis = db.Column(db.String(50))
    automation_level = db.Column(db.String(50))
    reporting_quality = db.Column(db.String(50))
    setup_complexity = db.Column(db.String(50))

    def to_dict(self):
        return {
            'ease_of_use': self.ease_of_use,
            'depth_of_analysis': self.depth_of_analysis,
            'automation_level': self.automation_level,
            'reporting_quality': self.reporting_quality,
            'setup_complexity': self.setup_complexity
        }

class UsageExample(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tool_id = db.Column(db.Integer, db.ForeignKey('tool.id'), nullable=False)
    tool = db.relationship('Tool', backref=db.backref('usage_examples', cascade="all, delete-orphan"))
    
    description = db.Column(db.String(255))
    example_cmd = db.Column(db.Text)

