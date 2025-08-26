<pre>
PetPass-DB/
├─ tables/                             
│  ├─ users.sql                        # Users table definition
│  │
│  │  Columns:
│  │   ├─ id (BIGSERIAL, PK)
│  │   ├─ full_name (VARCHAR(100), NOT NULL)
│  │   ├─ email (VARCHAR(255), UNIQUE, NOT NULL)
│  │   └─ google_id (VARCHAR(255), UNIQUE, NULL)
│  │
│  │
│  └─ pets.sql                         # Pets table definition
│     │
│     │  Enums:
│     │   ├─ species: ('dog','cat','ferret','other')
│     │   ├─ sex: ('male','female','unknown')
│     │   └─ status: ('active','lost','expired','replaced','deceased')
│     │
│     │  Columns:
│     │   ├─ id (BIGSERIAL, PK)
│     │   ├─ owner_user_id (BIGINT, FK → users.id, ON DELETE SET NULL)
│     │   ├─ name (VARCHAR(120), NOT NULL)
│     │   ├─ species (species ENUM, NOT NULL)
│     │   ├─ breed (VARCHAR(150), NULL)
│     │   ├─ sex (sex ENUM, DEFAULT 'unknown')
│     │   ├─ color_markings (VARCHAR(200), NULL)
│     │   ├─ date_of_birth (DATE, NULL)
│     │   ├─ country_of_birth (CHAR(2), NULL)
│     │   ├─ microchip_number (VARCHAR(50), UNIQUE, NOT NULL)
│     │   ├─ microchip_implant_date (DATE, NULL)
│     │   ├─ microchip_implant_location (VARCHAR(200), NULL)
│     │   ├─ tattoo_number (VARCHAR(50), NULL)
│     │   ├─ passport_number (VARCHAR(50), UNIQUE, NOT NULL)
│     │   ├─ country_of_issue (CHAR(2), NOT NULL)
│     │   ├─ issue_date (DATE, NOT NULL)
│     │   ├─ issuing_authority (VARCHAR(200), NULL)
│     │   ├─ current_status (status ENUM, DEFAULT 'active')
│     │   ├─ created_at (TIMESTAMP, DEFAULT NOW())
│     │   └─ updated_at (TIMESTAMP, DEFAULT NOW())
</pre>