from flask import Flask, render_template, jsonify, request, g, Blueprint
import json
import os
import sqlite3

app = Flask(__name__)

# === ROUTES FOR PAGES === #
@app.route('/index')
def index():
    return render_template('homepage.html')  # The main index page

@app.route("/")
def hello_world():
    return render_template('videoani.html')

@app.route('/knowledge')
def sanskrit():
    return render_template('knowledge.html')

@app.route('/map')
def map():
    return render_template('newmap.html')

@app.route('/timeline')
def timeline():
    return render_template('timeline.html')

@app.route('/game')
def game():
    return render_template('game.html')

@app.route('/tourism')
def tourism():
    return render_template('tourism.html')

@app.route('/ludogame')
def ludogame():
    return render_template('ludogame.html')


@app.route('/dynasty')
def dynasty():
    return render_template('dynasty.html')

@app.route('/ani')
def ani():
    return render_template('ani.html')

@app.route('/api/text-json')
def get_text_json():
    json_path = os.path.join(app.root_path, 'data', 'texts.json')
    with open(json_path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    return jsonify(data)

# === DATABASE CONNECTION HANDLER === #
def get_db():
    db = getattr(g, '_database', None)
    if db is None:
        db = g._database = sqlite3.connect('database/sanskrit_heritage.db')
        db.row_factory = sqlite3.Row
    return db

@app.teardown_appcontext
def close_connection(exception):
    db = getattr(g, '_database', None)
    if db is not None:
        db.close()


# === API: TEXTS === #

# === API: SAGES === #
@app.route('/api/sages', methods=['GET'])
def get_sages():
    search = request.args.get('search', '')
    era = request.args.get('era', '')
    contribution = request.args.get('contribution', '')

    db = get_db()
    cursor = db.cursor()
    query = 'SELECT * FROM sages WHERE 1=1'
    params = []

    if search:
        query += ' AND (name LIKE ? OR biography LIKE ?)'
        search_param = f'%{search}%'
        params.extend([search_param, search_param])

    if era:
        query += ' AND era = ?'
        params.append(era)

    if contribution:
        query += ' AND contribution LIKE ?'
        params.append(f'%{contribution}%')

    cursor.execute(query, params)

    sages = []
    for row in cursor.fetchall():
        sage = dict(row)
        cursor.execute('SELECT * FROM sage_works WHERE sage_id = ?', (row['id'],))
        sage['works'] = [dict(w) for w in cursor.fetchall()]
        sages.append(sage)

    return jsonify(sages)

@app.route('/api/sages/<int:sage_id>', methods=['GET'])
def get_sage_detail(sage_id):
    db = get_db()
    cursor = db.cursor()

    cursor.execute('SELECT * FROM sages WHERE id = ?', (sage_id,))
    sage = dict(cursor.fetchone())

    cursor.execute('SELECT * FROM sage_works WHERE sage_id = ?', (sage_id,))
    sage['works'] = [dict(w) for w in cursor.fetchall()]

    return jsonify(sage)


# === API: TIMELINE === #
@app.route('/api/timeline', methods=['GET'])
def get_timeline_data():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM timeline_periods ORDER BY start_date')

    periods = []
    for row in cursor.fetchall():
        period = dict(row)
        cursor.execute('SELECT * FROM timeline_events WHERE period_id = ?', (row['id'],))
        period['key_events'] = [dict(e) for e in cursor.fetchall()]
        periods.append(period)

    return jsonify(periods)


# === API: SANSKRIT WORDS === #
@app.route('/api/sanskrit-words', methods=['GET'])
def get_sanskrit_words():
    category = request.args.get('category', '')
    db = get_db()
    cursor = db.cursor()

    if category:
        cursor.execute('SELECT * FROM sanskrit_words WHERE category = ?', (category,))
    else:
        cursor.execute('SELECT * FROM sanskrit_words')

    return jsonify([dict(row) for row in cursor.fetchall()])


# === API: QUIZ === #
@app.route('/api/quiz', methods=['GET'])
def get_quiz_questions():
    category = request.args.get('category', '')
    difficulty = request.args.get('difficulty', '')
    limit = request.args.get('limit', 10)

    db = get_db()
    cursor = db.cursor()
    query = 'SELECT * FROM quiz_questions WHERE 1=1'
    params = []

    if category:
        query += ' AND category = ?'
        params.append(category)
    if difficulty:
        query += ' AND difficulty = ?'
        params.append(difficulty)

    query += ' ORDER BY RANDOM() LIMIT ?'
    params.append(limit)

    cursor.execute(query, params)

    questions = []
    for row in cursor.fetchall():
        question = dict(row)
        cursor.execute('SELECT * FROM quiz_answers WHERE question_id = ?', (row['id'],))
        question['answers'] = [dict(a) for a in cursor.fetchall()]
        questions.append(question)

    return jsonify(questions)


# === API: KNOWLEDGE MAP === #
@app.route('/api/knowledge-map', methods=['GET'])
def get_knowledge_map():
    db = get_db()
    cursor = db.cursor()
    cursor.execute('SELECT * FROM knowledge_map_hotspots')
    return jsonify([dict(row) for row in cursor.fetchall()])


# === DYNASTY BLUEPRINT === #
dynasty_bp = Blueprint('dynasty', __name__)

def get_db_connection_dynasty():
    conn = sqlite3.connect('database/sanskrit_dynasty.db')
    conn.row_factory = sqlite3.Row
    return conn

@dynasty_bp.route('/dynasty')
def dynasty():
    return render_template('dynasty.html')

@dynasty_bp.route('/api/dynasties')
def get_dynasties():
    category = request.args.get('category', 'mauryan')
    conn = get_db_connection_dynasty()
    dynasties = conn.execute('SELECT * FROM dynasties WHERE category = ?', (category,)).fetchall()
    conn.close()
    return jsonify([dict(d) for d in dynasties])

@dynasty_bp.route('/api/rulers')
def get_rulers():
    dynasty_id = request.args.get('dynasty_id')
    conn = get_db_connection_dynasty()
    if dynasty_id:
        rulers = conn.execute('SELECT * FROM rulers WHERE dynasty_id = ?', (dynasty_id,)).fetchall()
    else:
        rulers = conn.execute('SELECT * FROM rulers').fetchall()
    conn.close()
    return jsonify([dict(r) for r in rulers])

@dynasty_bp.route('/api/contributions')
def get_contributions():
    dynasty_id = request.args.get('dynasty_id')
    category = request.args.get('category')
    conn = get_db_connection_dynasty()
    query = 'SELECT * FROM contributions WHERE 1=1'
    params = []

    if dynasty_id:
        query += ' AND dynasty_id = ?'
        params.append(dynasty_id)
    if category:
        query += ' AND category = ?'
        params.append(category)

    contributions = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(c) for c in contributions])

@dynasty_bp.route('/api/timeline')
def get_dynasty_timeline():
    dynasty_id = request.args.get('dynasty_id')
    event_type = request.args.get('event_type')
    conn = get_db_connection_dynasty()
    query = '''
        SELECT e.*, d.name as dynasty_name FROM timeline_events e
        LEFT JOIN dynasties d ON e.dynasty_id = d.id WHERE 1=1
    '''
    params = []

    if dynasty_id:
        query += ' AND e.dynasty_id = ?'
        params.append(dynasty_id)
    if event_type:
        query += ' AND e.event_type = ?'
        params.append(event_type)

    events = conn.execute(query, params).fetchall()
    conn.close()
    return jsonify([dict(e) for e in events])

@dynasty_bp.route('/api/flashcards')
def get_flashcards():
    dynasty_id = request.args.get('dynasty_id')
    conn = get_db_connection_dynasty()
    if dynasty_id:
        flashcards = conn.execute('SELECT id, title, period, description, key_contribution FROM flashcards WHERE dynasty_id = ?', (dynasty_id,)).fetchall()
    else:
        flashcards = conn.execute('SELECT id, title, period, description, key_contribution FROM flashcards').fetchall()

    conn.close()
    return jsonify([dict(card) for card in flashcards])



# === REGISTER BLUEPRINTS AND RUN === #
app.register_blueprint(dynasty_bp)


DATABASE = 'tatva_research.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # To access columns by name
    return conn

@app.route('/research')
def research():
    search_query = request.args.get('search', '').strip()

    conn = get_db_connection()
    cursor = conn.cursor()

    if search_query:
        # Use LIKE for simple search in title, authors, category, and abstract
        like_query = f'%{search_query}%'
        cursor.execute('''
            SELECT * FROM papers
            WHERE title LIKE ? OR authors LIKE ? OR category LIKE ? OR abstract LIKE ?
            ORDER BY publication_date DESC
        ''', (like_query, like_query, like_query, like_query))
    else:
        cursor.execute('SELECT * FROM papers ORDER BY publication_date DESC')

    papers = cursor.fetchall()
    conn.close()

    return render_template('research.html', papers=papers)


# Route to get all papers
@app.route('/api/papers', methods=['GET'])
def get_papers():
    conn = get_db_connection()
    papers = conn.execute('SELECT id, title, abstract FROM papers').fetchall()
    conn.close()
    return jsonify([dict(paper) for paper in papers])

# Route to get full details of one paper
@app.route('/api/papers/<int:paper_id>', methods=['GET'])
def get_paper_details(paper_id):
    conn = get_db_connection()
    paper = conn.execute('SELECT * FROM papers WHERE id = ?', (paper_id,)).fetchone()
    conn.close()
    if paper is None:
        return jsonify({'error': 'Paper not found'}), 404
    return jsonify(dict(paper))





if __name__ == '__main__':
    app.run(debug=True , port= 9000)
