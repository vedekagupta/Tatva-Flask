import sqlite3
import os

# Create database directory if it doesn't exist
if not os.path.exists('database'):
    os.makedirs('database')

# Connect to SQLite database (will be created if it doesn't exist)
conn = sqlite3.connect('database/sanskrit_heritage.db')
cursor = conn.cursor()

# Create tables
def create_tables():
    # Table for ancient texts (Vedas, Upanishads, etc.)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS texts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        category TEXT NOT NULL, 
        period TEXT,
        description TEXT,
        full_description TEXT,
        significance TEXT,
        image_path TEXT
    )
    ''')
    
    # Table for key verses in texts
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS verses (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        text_id INTEGER NOT NULL,
        sanskrit_text TEXT,
        translation TEXT,
        FOREIGN KEY (text_id) REFERENCES texts(id) ON DELETE CASCADE
    )
    ''')
    
    # Table for sages (Rishis & Munis)
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        era TEXT,
        period TEXT,
        contribution TEXT,
        biography TEXT,
        image_path TEXT
    )
    ''')
    
    # Table for sage works/contributions
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sage_works (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sage_id INTEGER NOT NULL,
        work_title TEXT NOT NULL,
        description TEXT,
        FOREIGN KEY (sage_id) REFERENCES sages(id) ON DELETE CASCADE
    )
    ''')
    
    
    # Table for Sanskrit words for the word cloud
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS sanskrit_words (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        word TEXT NOT NULL,
        transliteration TEXT,
        translation TEXT,
        description TEXT,
        category TEXT
    )
    ''')
    
    # Table for quiz questions
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS quiz_questions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question TEXT NOT NULL,
        category TEXT,
        difficulty TEXT
    )
    ''')
    
    # Table for quiz answer options
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS quiz_answers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        question_id INTEGER NOT NULL,
        answer_text TEXT NOT NULL,
        is_correct BOOLEAN NOT NULL,
        explanation TEXT,
        FOREIGN KEY (question_id) REFERENCES quiz_questions(id) ON DELETE CASCADE
    )
    ''')
    
    # Table for knowledge map hotspots
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS knowledge_map_hotspots (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT,
        x_position INTEGER,
        y_position INTEGER
    )
    ''')

# Populate the database with sample data
def populate_sample_data():
    # Sample data for texts
    texts = [
        ('Rigveda', 'vedas', 'c. 1500 BCE - 1200 BCE', 
         'The oldest and most significant of the Vedas, containing hymns dedicated to various deities.',
         'The Rigveda is the oldest of the four Vedas and one of the oldest extant texts in any Indo-European language. It contains 1,028 hymns (sūktas) dedicated to various deities, particularly Indra, Agni, and Soma. The text is organized in 10 books or "mandalas".',
         'The Rigveda is crucial for understanding early Vedic religion, culture, and language. It forms the bedrock of Hindu philosophy and provides insights into ancient Indo-Aryan society.',
         'static/images/rigveda.jpg'),
        
        ('Samaveda', 'vedas', 'c. 1200 BCE - 900 BCE',
         'Contains melodies and chants for rituals, largely derived from the Rigveda.',
         'The Samaveda is essentially a collection of samans, verses from the Rigveda set to musical notation. It consists of 1,875 verses, with only 75 that are not found in the Rigveda. The purpose of the Samaveda was for the udgātṛ priests who sang the verses during rituals.',
         'The Samaveda is considered the origin of Indian music and is important for the development of classical Indian musical traditions. It demonstrates the profound connection between spirituality and music in Vedic culture.',
         'static/images/samaveda.jpg'),
         
        ('Chandogya Upanishad', 'upanishads', 'c. 800 BCE - 600 BCE',
         'One of the oldest Upanishads, associated with the Samaveda.',
         'The Chandogya Upanishad is among the primary Upanishads and forms part of the Chandogya Brahmana of the Samaveda. It consists of eight chapters that discuss meditation, the nature of Brahman, and the concept of Self (Atman).',
         'The Chandogya Upanishad contains the famous instruction "Tat Tvam Asi" (That Thou Art), which is one of the Mahavakyas expressing the unity of Atman with Brahman.',
         'static/images/chandogya.jpg'),
         
        ('Mahabharata', 'itihasa', 'c. 400 BCE - 400 CE',
         'One of the two major Sanskrit epics of ancient India.',
         'The Mahabharata is an epic narrative of the Kurukshetra War between the Kauravas and the Pandavas and the fates of the warrior dynasties. With approximately 100,000 shlokas (verses) across 18 parvas (books), it is the longest epic poem known.',
         'The Mahabharata contains the Bhagavad Gita, a philosophical dialogue between Krishna and Arjuna that has profound significance in Hindu thought. The epic addresses concepts of dharma, duty, righteousness, and human values.',
         'static/images/mahabharata.jpg')
    ]
    
    for text in texts:
        cursor.execute('''
        INSERT INTO texts (title, category, period, description, full_description, significance, image_path)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ''', text)
        
    
    # Sample data for verses
    verses = [
        (1, 'अग्निमीळे पुरोहितं यज्ञस्य देवमृत्विजम् । होतारं रत्नधातमम् ॥', 'I praise Agni, the household priest, the divine minister of the sacrifice, the invoker who confers the greatest wealth.'),
        (1, 'दिवो वा पृथिव्या अधि | हिरण्यपाणिरमिमीत सूर्यमरोचयत्', 'From heaven or from the earth, the golden-handed Sun measures out his path and illuminates all.'),
        (3, 'तत्त्वमसि', 'That thou art (You are that)'),
        (3, 'सर्वं खल्विदं ब्रह्म', 'All of this is indeed Brahman')
    ]
    
    for verse in verses:
        cursor.execute('''
        INSERT INTO verses (text_id, sanskrit_text, translation)
        VALUES (?, ?, ?)
        ''', verse)
    
    # Sample data for sages
    sages = [
        ('Maharishi Vyasa', 'Epic', 'Dwapara Yuga', 'Author of the Mahabharata and compiler of the Vedas', 
         'Maharishi Vyasa, also known as Krishna Dvaipayana, is traditionally regarded as the compiler of the Vedas into four parts and the author of the Mahabharata, the Puranas, and the Brahmasutras. He was the son of Rishi Parashara and Satyavati. He is one of the most revered sages in Hindu tradition and is sometimes referred to as "Veda Vyasa" due to his role in organizing the Vedas.',
          'static/images/r1.jpeg'),
        
        ('Maharishi Valmiki', 'Epic', 'Treta Yuga', 'Author of the Ramayana', 
         'Maharishi Valmiki is celebrated as the poet harbinger in Sanskrit literature and the author of the epic Ramayana. According to legend, he was a robber who underwent a profound transformation after meeting Sage Narada and became a great ascetic. The Ramayana consists of 24,000 verses in seven cantos (kandas) and narrates the journey of Lord Rama.',
         'static/images/r2.jpeg'),
         
        ('Maharishi Patanjali', 'Philosophy', 'c. 200 BCE - 200 CE', 'Author of the Yoga Sutras', 
         'Maharishi Patanjali was a sage in ancient India who compiled the Yoga Sutras, one of the foundational texts of classical yoga philosophy. The text consists of 195 aphorisms (sutras) that outline the eight limbs of yoga and provide a systematic approach to spiritual development. Patanjali is also associated with works on Ayurveda and Sanskrit grammar.',
         'static/images/r3.jpeg'),
         
        ('Maharishi Charaka', 'Medicine', 'c. 300 BCE - 200 CE', 'Father of Ayurveda', 
         'Maharishi Charaka was one of the principal contributors to Ayurveda, the ancient Indian system of medicine. He authored the Charaka Samhita, a foundational text in Ayurvedic medicine that covers principles and theories about health, disease, and treatment methodologies. The text includes detailed descriptions of various diseases, diagnostic procedures, and treatments.',
         'static/images/r4.jpeg'),
         
        ('Maharishi Vasishtha', 'Vedic', 'Ancient', 'One of the Saptarishis', 
         'Maharishi Vasishtha is one of the seven great sages (Saptarishis) in ancient Hindu texts. He was the manasaputra (mind-born son) of Lord Brahma and the guru of Lord Rama. Vasishtha is celebrated for his profound wisdom and spiritual knowledge, and he appears in various sacred texts, including the Rigveda and Ramayana.',
         'static/images/r5.jpeg'),

    ]
    
    for sage in sages:
        cursor.execute('''
        INSERT INTO sages (name, era, period, contribution, biography, image_path)
        VALUES (?, ?, ?, ?, ?, ?)
        ''', sage)
    
    # Sample data for sage works
    sage_works = [
        (1, 'Mahabharata', 'The longest epic poem in the world'),
        (1, 'Brahmasutra', 'A key philosophical text in the Vedanta school'),
        (1, 'Arrangement of the Vedas', 'Organization of the Vedas into four parts'),
        (2, 'Ramayana', 'The epic story of Lord Rama'),
        (2, 'Yoga Vasishtha', 'A discourse on yoga philosophy'),
        (3, 'Yoga Sutras', 'Foundational text on yoga philosophy'),
        (3, 'Mahabhashya', 'Commentary on Sanskrit grammar'),
        (4, 'Charaka Samhita', 'Foundational text on Ayurvedic medicine'),
        (5, 'Vasishtha Samhita', 'Collection of teachings and philosophical insights')
    ]
    
    for work in sage_works:
        cursor.execute('''
        INSERT INTO sage_works (sage_id, work_title, description)
        VALUES (?, ?, ?)
        ''', work)
    
    # Sample data for timeline periods
    timeline_periods = [
        ('Vedic Period', 'c. 1500 BCE', 'c. 500 BCE', 'The period when the Vedas were composed and compiled.'),
        ('Epic Period', 'c. 500 BCE', 'c. 200 CE', 'The period when the great epics Ramayana and Mahabharata were composed.'),
        ('Classical Period', 'c. 200 CE', 'c. 1100 CE', 'The golden age of Sanskrit literature and philosophy.'),
        ('Medieval Period', 'c. 1100 CE', 'c. 1800 CE', 'The period of commentaries and diverse interpretations.')
    ]
    
    for period in timeline_periods:
        cursor.execute('''
        INSERT INTO timeline_periods (name, start_date, end_date, description)
        VALUES (?, ?, ?, ?)
        ''', period)
    
    # Sample data for timeline events
    timeline_events = [
        (1, 'Composition of Rigveda', 'c. 1500 BCE - 1200 BCE'),
        (1, 'Compilation of the Upanishads', 'c. 800 BCE - 500 BCE'),
        (2, 'Composition of the Ramayana', 'c. 500 BCE - 200 BCE'),
        (2, 'Compilation of the Mahabharata', 'c. 400 BCE - 400 CE'),
        (3, 'Works of Kalidasa', 'c. 4th - 5th century CE'),
        (3, 'Adi Shankaracharya\'s commentaries', 'c. 8th century CE'),
        (4, 'Development of the six schools of philosophy', 'c. 1100 CE - 1700 CE')
    ]
    
    for event in timeline_events:
        cursor.execute('''
        INSERT INTO timeline_events (period_id, event_description, approximate_date)
        VALUES (?, ?, ?)
        ''', event)
    
    # Sample data for Sanskrit words
    sanskrit_words = [
        ('ध्यान', 'Dhyāna', 'Meditation', 'Focused concentration or meditation on a single object or thought.', 'Philosophy'),
        ('कर्म', 'Karma', 'Action', 'The principle of cause and effect where intent and actions influence future outcomes.', 'Philosophy'),
        ('योग', 'Yoga', 'Union', 'The practice of uniting body, mind, and spirit.', 'Practice'),
        ('ब्रह्म', 'Brahman', 'Ultimate Reality', 'The supreme, unchanging reality that is the source of all existence.', 'Philosophy'),
        ('आत्मन्', 'Ātman', 'Self/Soul', 'The individual self or soul that is identical with Brahman.', 'Philosophy'),
        ('वेद', 'Veda', 'Knowledge', 'Sacred knowledge or revelation in Hinduism.', 'Scripture')
    ]
    
    for word in sanskrit_words:
        cursor.execute('''
        INSERT INTO sanskrit_words (word, transliteration, translation, description, category)
        VALUES (?, ?, ?, ?, ?)
        ''', word)
    
    # Sample data for quiz questions
    quiz_questions = [
        ('Which is the oldest of the four Vedas?', 'Vedas', 'Easy'),
        ('Who compiled the Vedas into four parts?', 'Sages', 'Medium'),
        ('What is the famous instruction found in the Chandogya Upanishad?', 'Upanishads', 'Medium'),
        ('Who is known as the author of the Ramayana?', 'Epics', 'Easy')
    ]
    
    for question in quiz_questions:
        cursor.execute('''
        INSERT INTO quiz_questions (question, category, difficulty)
        VALUES (?, ?, ?)
        ''', question)
    
    # Sample data for quiz answers
    quiz_answers = [
        (1, 'Rigveda', 1, 'The Rigveda is the oldest of the four Vedas, composed around 1500 BCE.'),
        (1, 'Samaveda', 0, ''),
        (1, 'Yajurveda', 0, ''),
        (1, 'Atharvaveda', 0, ''),
        (2, 'Maharishi Vyasa', 1, 'Maharishi Vyasa, also known as Krishna Dvaipayana, compiled the Vedas into four parts.'),
        (2, 'Maharishi Valmiki', 0, ''),
        (2, 'Maharishi Patanjali', 0, ''),
        (2, 'Maharishi Vasishtha', 0, ''),
        (3, 'Tat Tvam Asi (That Thou Art)', 1, 'This Mahavakya expresses the unity of the individual soul (Atman) with the supreme reality (Brahman).'),
        (3, 'Aham Brahmasmi (I am Brahman)', 0, ''),
        (3, 'Prajnanam Brahma (Consciousness is Brahman)', 0, ''),
        (3, 'Ayam Atma Brahma (This Self is Brahman)', 0, ''),
        (4, 'Maharishi Valmiki', 1, 'Maharishi Valmiki is celebrated as the author of the Ramayana.'),
        (4, 'Maharishi Vyasa', 0, ''),
        (4, 'Maharishi Vasishtha', 0, ''),
        (4, 'Maharishi Vishwamitra', 0, '')
    ]
    
    for answer in quiz_answers:
        cursor.execute('''
        INSERT INTO quiz_answers (question_id, answer_text, is_correct, explanation)
        VALUES (?, ?, ?, ?)
        ''', answer)
    
    # Sample data for knowledge map hotspots
    hotspots = [
        ('Rigveda', 'The oldest and most significant of the Vedas, containing hymns dedicated to various deities.', 15, 30),
        ('Samaveda', 'Contains melodies and chants for rituals, largely derived from the Rigveda.', 30, 20),
        ('Yajurveda', 'Consists of prose mantras and formulas used in sacrificial ceremonies.', 45, 25),
        ('Atharvaveda', 'Contains spells, charms, and speculative hymns for various aspects of everyday life.', 60, 20),
        ('Upanishads', 'Philosophical texts discussing metaphysics, the nature of reality, consciousness, and liberation.', 75, 30),
        ('Vedangas', 'Six auxiliary disciplines that aid in the understanding and application of Vedic knowledge.', 40, 70)
    ]
    
    for hotspot in hotspots:
        cursor.execute('''
        INSERT INTO knowledge_map_hotspots (title, content, x_position, y_position)
        VALUES (?, ?, ?, ?)
        ''', hotspot)

# Execute the function calls
create_tables()
populate_sample_data()

# Commit changes and close connection
conn.commit()
conn.close()

print("Database created and populated successfully.")
