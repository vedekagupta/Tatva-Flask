import sqlite3
import os

# Create database directory if it doesn't exist
if not os.path.exists('database'):
    os.makedirs('database')

# Database connection and initialization
def init_db():
    conn = sqlite3.connect('database/sanskrit_dynasty.db')
    cursor = conn.cursor()
    
    # Create tables
    
    # Dynasties table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS dynasties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        category TEXT NOT NULL,
        period TEXT NOT NULL,
        description TEXT NOT NULL,
        full_description TEXT NOT NULL,
        image TEXT NOT NULL,
        significance TEXT
    )
    ''')
    
    # Rulers table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS rulers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dynasty_id INTEGER NOT NULL,
        reign_period TEXT NOT NULL,
        biography TEXT NOT NULL,
        achievements TEXT NOT NULL,
        image TEXT,
        FOREIGN KEY (dynasty_id) REFERENCES dynasties (id)
    )
    ''')
    
    # Cultural contributions table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS contributions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        dynasty_id INTEGER NOT NULL,
        category TEXT NOT NULL,
        detail TEXT NOT NULL,
        significance TEXT NOT NULL,
        image TEXT,
        FOREIGN KEY (dynasty_id) REFERENCES dynasties (id)
    )
    ''')
    
    # Timeline events table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS timeline_events (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        year TEXT NOT NULL,
        event_name TEXT NOT NULL,
        description TEXT NOT NULL,
        dynasty_id INTEGER,
        event_type TEXT NOT NULL,
        significance TEXT,
        FOREIGN KEY (dynasty_id) REFERENCES dynasties (id)
    )
    ''')
    
    # Genealogy relationships table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS genealogy (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ruler_id INTEGER NOT NULL,
        parent_id INTEGER,
        relationship_type TEXT NOT NULL,
        notes TEXT,
        FOREIGN KEY (ruler_id) REFERENCES rulers (id),
        FOREIGN KEY (parent_id) REFERENCES rulers (id)
    )
    ''')
    
    # Dynasty flashcards table
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS flashcards (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        dynasty_id INTEGER NOT NULL,
        period TEXT NOT NULL,
        description TEXT NOT NULL,
        key_contribution TEXT NOT NULL,
        FOREIGN KEY (dynasty_id) REFERENCES dynasties (id)
    )
    ''')
    
    conn.commit()
    return conn

# Insert sample data
def populate_sample_data(conn):
    cursor = conn.cursor()
    
    # Insert dynasties
    dynasties = [
        (
            'Mauryan Empire',
            'mauryan',
            '322 BCE - 185 BCE',
            'Founded by Chandragupta Maurya, unified most of India under one administration.',
            'The Maurya Empire was a geographically extensive Iron Age historical power in South Asia based in Magadha, founded by Chandragupta Maurya in 322 BCE, and existing at its greatest extent from 322 to 185 BCE. The empire was expanded into India\'s central and southern regions by Emperor Bindusara, but it excluded a small portion of unexplored tribal and forested regions near Kalinga.',
            'static\images\maurya.jpg',
            'First unified empire of the Indian subcontinent, noteworthy for its military strength, administrative innovations, and promotion of Buddhism under Ashoka.'
        ),
        (
            'Gupta Empire',
            'gupta',
            '320 CE - 550 CE',
            'Known as the Golden Age of India due to advancements in science, art, and mathematics.',
            'The Gupta Empire was an ancient Indian empire which existed from the early 4th century CE to late 6th century CE. At its zenith, from approximately 320 to 550 CE, it covered much of the Indian subcontinent. This period is considered as the Golden Age of India by historians. The ruling dynasty of the empire was founded by the king Sri Gupta; the most notable rulers of the dynasty were Chandragupta I, Samudragupta, and Chandragupta II, also known as Vikramaditya.',
            'static/images/dynasties/gupta.jpg',
            'Considered the Golden Age of India for achievements in science, mathematics, astronomy, religion, philosophy, and art.'
        ),
        (
            'Satavahana Dynasty',
            'satavahana',
            '1st century BCE - 3rd century CE',
            'Deccan-based dynasty that controlled central India after the decline of the Mauryas.',
            'The Satavahanas, also referred to as the Andhras in the Puranas, were an ancient Indian dynasty based in the Deccan region. Most modern scholars believe that the Satavahana rule began in the late second century BCE and lasted until the early third century CE. The Satavahana kingdom mainly comprised the present-day Telangana, Andhra Pradesh and Maharashtra.',
            'static/images/dynasties/satavahana.jpg',
            'Built important trade networks between northern and southern India, and promoted both Buddhism and Hinduism.'
        ),
        (
            'Chola Dynasty',
            'chola',
            '300 BCE - 1279 CE',
            'South Indian dynasty famous for naval power and cultural achievements.',
            'The Chola dynasty was a Tamil dynasty of southern India, one of the longest-ruling dynasties in world history. The earliest datable references to the Chola are in inscriptions from the 3rd century BCE. The heartland of the Cholas was the fertile valley of the Kaveri River. They built magnificent temples like the Brihadisvara Temple in Thanjavur.',
            'static/images/dynasties/chola.jpg',
            'Known for naval power, extensive maritime trade networks, and patronage of art and architecture including bronze sculptures.'
        ),
        (
            'Mughal Empire',
            'mughal',
            '1526 - 1857',
            'Established by Babur, known for art, culture, and architecture like Taj Mahal.',
            'The Mughal Empire was an early-modern empire that controlled much of South Asia between the 16th and 19th centuries. It consolidated Islam in South Asia, and spread Muslim arts and culture as well as the faith. The Mughals were descendants of the Timurids. Their power rapidly dwindled during the 18th century and the last emperor was deposed in 1857.',
            'static/images/dynasties/mughal.jpg',
            'Centralized administration, development of art and architecture including Taj Mahal, and syncretic religious policies.'
        ),
        (
            'Rajput Kingdoms',
            'rajput',
            '7th century - 20th century',
            'Warrior clans that dominated northern and central India with chivalric code.',
            'The Rajputs were a cluster of warrior clans who claimed Kshatriya status. The Rajput kingdoms were disparate and fragmented, although they commanded immense loyalty from their soldiers. Several Rajput kingdoms emerged in the 7th century, based in modern-day Rajasthan. They were known for their martial ethos and chivalry code called Kshatriadharma.',
            'static/images/dynasties/rajput.jpg',
            'Known for martial traditions, distinctive style of architecture, and resistance to foreign invasions.'
        )
    ]
    
    cursor.executemany('''
    INSERT INTO dynasties (name, category, period, description, full_description, image, significance)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', dynasties)
    
    # Get dynasty IDs for foreign keys
    cursor.execute("SELECT id, name FROM dynasties")
    dynasty_ids = {name: id for id, name in cursor.fetchall()}
    
    # Insert rulers
    rulers = [
        (
            'Chandragupta Maurya',
            dynasty_ids['Mauryan Empire'],
            '322 BCE - 298 BCE',
            'Founder of the Maurya Empire who overthrew the Nanda dynasty with the help of Chanakya.',
            'Established centralized administration, built extensive road networks, and expanded empire through conquest.',
            'static/images/rulers/chandragupta_maurya.jpg'
        ),
        (
            'Ashoka the Great',
            dynasty_ids['Mauryan Empire'],
            '268 BCE - 232 BCE',
            'Grandson of Chandragupta Maurya who embraced Buddhism after witnessing the devastation of the Kalinga War.',
            'Implemented welfare programs, spread Buddhism, established rock and pillar edicts, and promoted non-violence.',
            'static/images/rulers/ashoka.jpg'
        ),
        (
            'Chandragupta I',
            dynasty_ids['Gupta Empire'],
            '320 CE - 335 CE',
            'Founder of the Gupta Empire who started as a local chief in the Magadha region.',
            'Established foundation for Gupta expansion, married Lichchhavi princess to strengthen position.',
            'static/images/rulers/chandragupta_i.jpg'
        ),
        (
            'Samudragupta',
            dynasty_ids['Gupta Empire'],
            '335 CE - 375 CE',
            'Son of Chandragupta I, known as the "Napoleon of India" for his military conquests.',
            'Expanded empire through military campaigns, patronized arts and literature, and performed Ashvamedha sacrifice.',
            'static/images/rulers/samudragupta.jpg'
        ),
        (
            'Chandragupta II',
            dynasty_ids['Gupta Empire'],
            '380 CE - 415 CE',
            'Son of Samudragupta, also known as Vikramaditya, ruled during the height of Gupta Empire.',
            'Defeated Western Satraps, promoted art and culture, including nine gems (navratnas) in his court.',
            'static/images/rulers/chandragupta_ii.jpg'
        ),
        (
            'Rajaraja Chola I',
            dynasty_ids['Chola Dynasty'],
            '985 CE - 1014 CE',
            'Greatest king of the Chola dynasty who expanded the empire significantly.',
            'Built the Brihadisvara Temple, strengthened naval power, and conquered Sri Lanka and parts of Southeast Asia.',
            'static/images/rulers/rajaraja_chola.jpg'
        ),
        (
            'Emperor Akbar',
            dynasty_ids['Mughal Empire'],
            '1556 - 1605',
            'Third Mughal emperor who is known for his religious tolerance and administrative reforms.',
            'Established Din-i-Ilahi, reformed taxation system, and promoted arts and culture at court.',
            'static/images/rulers/akbar.jpg'
        ),
        (
            'Shah Jahan',
            dynasty_ids['Mughal Empire'],
            '1628 - 1658',
            'Fifth Mughal emperor famous for building the Taj Mahal as a memorial to his wife Mumtaz Mahal.',
            'Constructed Red Fort, Jama Masjid, and other architectural marvels, but known for lavish spending.',
            'static/images/rulers/shah_jahan.jpg'
        ),
        (
            'Maharana Pratap',
            dynasty_ids['Rajput Kingdoms'],
            '1572 - 1597',
            'The ruler of Mewar known for his resistance against the Mughal Empire.',
            'Fought Battle of Haldighati against Akbar\'s forces, continued guerrilla warfare from hills.',
            'static/images/rulers/maharana_pratap.jpg'
        )
    ]
    
    cursor.executemany('''
    INSERT INTO rulers (name, dynasty_id, reign_period, biography, achievements, image)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', rulers)
    
    # Get ruler IDs for genealogy relationships
    cursor.execute("SELECT id, name FROM rulers")
    ruler_ids = {name: id for id, name in cursor.fetchall()}
    
    # Insert genealogy relationships
    genealogy = [
        (
            ruler_ids['Samudragupta'],
            ruler_ids['Chandragupta I'],
            'son',
            'Direct successor'
        ),
        (
            ruler_ids['Chandragupta II'],
            ruler_ids['Samudragupta'],
            'son',
            'Direct successor'
        ),
        (
            ruler_ids['Ashoka the Great'],
            None,  # We don't have Bindusara in our sample data
            'grandson',
            'Grandson of Chandragupta Maurya, son of Bindusara'
        ),
        (
            ruler_ids['Shah Jahan'],
            None,  # We don't have Jahangir in our sample data
            'son',
            'Son of Emperor Jahangir'
        )
    ]
    
    cursor.executemany('''
    INSERT INTO genealogy (ruler_id, parent_id, relationship_type, notes)
    VALUES (?, ?, ?, ?)
    ''', genealogy)
    
    # Insert cultural contributions
    contributions = [
        (
            'Gupta Architecture',
            dynasty_ids['Gupta Empire'],
            'architecture',
            'Built intricate temples, including Dashavatara Temple at Deogarh.',
            'Established Hindu architectural patterns that influenced temple design for centuries.',
            'static/images/contributions/gupta-temple.jpg'
        ),
        (
            'Chola Bronze Art',
            dynasty_ids['Chola Dynasty'],
            'art',
            'Famous for detailed bronze sculptures of Nataraja and others.',
            'Developed unique metal casting techniques and aesthetic style representing divine figures.',
            'static/images/contributions/chola-bronze.jpg'
        ),
        (
            'Mauryan Pillars',
            dynasty_ids['Mauryan Empire'],
            'architecture',
            'Stone pillars with inscriptions and sculptures, including the Lion Capital of Ashoka.',
            'Demonstrated advanced stone carving techniques and spread Ashokan edicts across the empire.',
            'static/images/contributions/mauryan-pillar.jpg'
        ),
        (
            'Mughal Miniature Paintings',
            dynasty_ids['Mughal Empire'],
            'art',
            'Detailed paintings depicting court scenes, battles, and legends.',
            'Combined Persian, Indian, and European styles to create distinctive art form.',
            'static/images/contributions/mughal-miniature.jpg'
        ),
        (
            'Sanskrit Literature Revival',
            dynasty_ids['Gupta Empire'],
            'literature',
            'Patronage of scholars like Kalidasa and development of Sanskrit drama.',
            'Produced classics of Indian literature including Abhijnanasakuntalam and Meghaduta.',
            'static/images/contributions/sanskrit-manuscripts.jpg'
        ),
        (
            'Rajput Military Architecture',
            dynasty_ids['Rajput Kingdoms'],
            'architecture',
            'Hill forts with advanced defensive features adapted to desert landscape.',
            'Developed unique military architecture suited to terrain and climate of Rajasthan.',
            'static/images/contributions/rajput-fort.jpg'
        )
    ]
    
    cursor.executemany('''
    INSERT INTO contributions (title, dynasty_id, category, detail, significance, image)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', contributions)
    
    # Insert timeline events
    timeline_events = [
        (
            '322 BCE',
            'Founding of Mauryan Empire',
            'Chandragupta Maurya establishes the Mauryan Empire with help from Chanakya.',
            dynasty_ids['Mauryan Empire'],
            'political',
            'First major empire of the Indian subcontinent'
        ),
        (
            '261 BCE',
            'Kalinga War',
            'Ashoka conquers Kalinga (modern Odisha) in a bloody war that leads to his conversion to Buddhism.',
            dynasty_ids['Mauryan Empire'],
            'military',
            'Turning point in Ashoka\'s reign and spread of Buddhism'
        ),
        (
            '320 CE',
            'Establishment of Gupta Empire',
            'Chandragupta I founds the Gupta dynasty by expanding control from Magadha.',
            dynasty_ids['Gupta Empire'],
            'political',
            'Beginning of the Golden Age of India'
        ),
        (
            '455 CE',
            'Hun Invasions',
            'White Huns (Hephthalites) begin invading northwestern India, weakening Gupta Empire.',
            dynasty_ids['Gupta Empire'],
            'military',
            'Beginning of the decline of Gupta power'
        ),
        (
            '985 CE',
            'Rajaraja Chola I Ascends Throne',
            'Beginning of Chola expansion under Rajaraja I\'s leadership.',
            dynasty_ids['Chola Dynasty'],
            'political',
            'Start of peak period of Chola influence'
        ),
        (
            '1526 CE',
            'First Battle of Panipat',
            'Babur defeats Ibrahim Lodi to establish Mughal rule in India.',
            dynasty_ids['Mughal Empire'],
            'military',
            'Established Mughal Dynasty in India'
        ),
        (
            '1576 CE',
            'Battle of Haldighati',
            'Akbar\'s forces fight against Maharana Pratap of Mewar.',
            dynasty_ids['Rajput Kingdoms'],
            'military',
            'Symbolizes Rajput resistance against Mughal expansion'
        ),
        (
            '1632-1653 CE',
            'Construction of Taj Mahal',
            'Shah Jahan builds the Taj Mahal as a tomb for his wife Mumtaz Mahal.',
            dynasty_ids['Mughal Empire'],
            'cultural',
            'Greatest architectural achievement of Mughal Empire'
        )
    ]
    
    cursor.executemany('''
    INSERT INTO timeline_events (year, event_name, description, dynasty_id, event_type, significance)
    VALUES (?, ?, ?, ?, ?, ?)
    ''', timeline_events)
    
    # Insert flashcards
    flashcards = [
        (
            'Chandragupta Maurya',
            dynasty_ids['Mauryan Empire'],
            '322–298 BCE',
            'Founder of the Maurya Empire with the help of Chanakya.',
            'Unified India and established central governance.'
        ),
        (
            'Ashoka the Great',
            dynasty_ids['Mauryan Empire'],
            '268–232 BCE',
            'Expanded the empire to its peak and promoted Buddhism.',
            'Edicts of Ashoka and spread of Dhamma.'
        ),
        (
            'Samudragupta',
            dynasty_ids['Gupta Empire'],
            '335-375 CE',
            'Known as the "Napoleon of India" for his military conquests.',
            'Expanded empire through conquests and patronage of arts.'
        ),
        (
            'Rajaraja Chola I',
            dynasty_ids['Chola Dynasty'],
            '985-1014 CE',
            'Great Chola emperor who built the Brihadisvara Temple.',
            'Naval expansion and cultural development.'
        ),
        (
            'Emperor Akbar',
            dynasty_ids['Mughal Empire'],
            '1556-1605 CE',
            'Third Mughal emperor known for religious tolerance.',
            'Din-i-Ilahi and administrative reforms.'
        ),
        (
            'Maharana Pratap',
            dynasty_ids['Rajput Kingdoms'],
            '1572-1597 CE',
            'Mewar ruler who resisted Mughal invasion.',
            'Symbol of Rajput resistance and valor.'
        )
    ]
    
    cursor.executemany('''
    INSERT INTO flashcards (title, dynasty_id, period, description, key_contribution)
    VALUES (?, ?, ?, ?, ?)
    ''', flashcards)
    
    conn.commit()

# Function to retrieve dynasties by category
def get_dynasties_by_category(conn, category):
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM dynasties WHERE category = ?', (category,))
    return cursor.fetchall()

# Function to retrieve all rulers for a dynasty
def get_rulers_by_dynasty(conn, dynasty_id):
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM rulers WHERE dynasty_id = ?', (dynasty_id,))
    return cursor.fetchall()

# Function to retrieve cultural contributions by dynasty
def get_contributions_by_dynasty(conn, dynasty_id):
    cursor = conn.cursor()
    cursor.execute('SELECT * FROM contributions WHERE dynasty_id = ?', (dynasty_id,))
    return cursor.fetchall()

# Function to retrieve timeline events
def get_timeline_events(conn, dynasty_id=None):
    cursor = conn.cursor()
    if dynasty_id:
        cursor.execute('SELECT * FROM timeline_events WHERE dynasty_id = ? ORDER BY year', (dynasty_id,))
    else:
        cursor.execute('SELECT * FROM timeline_events ORDER BY year')
    return cursor.fetchall()

# Function to get flashcards
def get_flashcards(conn, dynasty_id=None):
    cursor = conn.cursor()
    if dynasty_id:
        cursor.execute('SELECT * FROM flashcards WHERE dynasty_id = ?', (dynasty_id,))
    else:
        cursor.execute('SELECT * FROM flashcards')
    
    return cursor.fetchall()

# Function to get genealogy for a dynasty
def get_genealogy(conn, dynasty_id):
    cursor = conn.cursor()
    cursor.execute('''
    SELECT g.*, r1.name as ruler_name, r2.name as parent_name 
    FROM genealogy g
    JOIN rulers r1 ON g.ruler_id = r1.id
    LEFT JOIN rulers r2 ON g.parent_id = r2.id
    WHERE r1.dynasty_id = ?
    ''', (dynasty_id,))
    return cursor.fetchall()

# Main function to initialize and populate the database if needed
def main():
    db_path = 'database/sanskrit_dynasty.db'
    
    # Check if database already exists
    if not os.path.exists(db_path):
        print("Creating and initializing database...")
        conn = init_db()
        populate_sample_data(conn)
        print("Database initialized with sample data.")
    else:
        print("Database already exists.")
        conn = sqlite3.connect(db_path)
    
    # Example of retrieving data
    print("\nMauryan Dynasty Rulers:")
    cursor = conn.cursor()
    cursor.execute("SELECT id FROM dynasties WHERE category = 'mauryan'")
    mauryan_id = cursor.fetchone()[0]
    
    rulers = get_rulers_by_dynasty(conn, mauryan_id)
    for ruler in rulers:
        print(f"- {ruler[1]} ({ruler[3]})")
    
    conn.close()

if __name__ == "__main__":
    main()