import sqlite3

def init_db():
    conn = sqlite3.connect('tatva_research.db')
    cursor = conn.cursor()

    # Create table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS papers (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            authors TEXT,
            publication_date TEXT,
            category TEXT,
            abstract TEXT
        )
    ''')

    # Check if already inserted
    cursor.execute('SELECT COUNT(*) FROM papers')
    if cursor.fetchone()[0] == 0:
        sample_papers = [
            ('Exploring Ancient Texts', 'Dr. A Sharma, Prof. B Singh', '2023-05-10', 'History', 'This paper explores ancient Indian texts and their relevance today.'),
            ('Modern Applications of Ayurveda', 'Dr. C Kumar', '2024-01-15', 'Medicine', 'A study on how Ayurveda is being applied in modern medicine.'),
            ('Sanskrit Computational Linguistics', 'R. Gupta, S. Iyer', '2022-11-20', 'Linguistics', 'Using computational techniques to analyze Sanskrit grammar and syntax.'),
            ('Vedic Astronomy and Mathematics', 'Dr. N Rao', '2021-06-18', 'Astronomy', 'An overview of astronomical methods in Vedic scriptures.'),
            ('The Role of Dharma in Governance', 'Prof. Meera Joshi', '2023-09-25', 'Philosophy', 'Explores how dharmic principles influence governance in ancient India.'),
            ('Indigenous Metallurgy Techniques', 'K. Sinha', '2022-03-14', 'Science & Tech', 'Describes the ancient Indian advancements in metallurgy and material science.'),
            ('Yoga and Mental Health', 'Dr. T. Banerjee', '2023-12-05', 'Wellness', 'Impact of yogic practices on psychological well-being.'),
            ('Environmental Wisdom in Ancient Texts', 'A. Mishra', '2021-11-30', 'Ecology', 'Eco-friendly practices found in Rigveda and other texts.'),
        ]

        cursor.executemany('''
            INSERT INTO papers (title, authors, publication_date, category, abstract)
            VALUES (?, ?, ?, ?, ?)
        ''', sample_papers)

    conn.commit()
    conn.close()

if __name__ == '__main__':
    init_db()
