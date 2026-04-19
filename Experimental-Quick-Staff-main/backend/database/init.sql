


DROP TABLE IF EXISTS notifications CASCADE;
DROP TABLE IF EXISTS payments CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS job_requests CASCADE;
DROP TABLE IF EXISTS worker_services CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS worker_profiles CASCADE;
DROP TABLE IF EXISTS saved_workers CASCADE;
DROP TABLE IF EXISTS saved_clients CASCADE;
DROP TABLE IF EXISTS email_otps CASCADE;
DROP TABLE IF EXISTS users CASCADE;


CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('client', 'worker', 'admin')),
    phone VARCHAR(20),
    address TEXT,
    profile_image VARCHAR(500),
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE worker_profiles ( 
    id SERIAL PRIMARY KEY,
    user_id INTEGER UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100),
    bio TEXT,
    skills TEXT[],
    years_of_experience INTEGER,
    hourly_rate DECIMAL(10, 2),
    availability JSONB,
    rating DECIMAL(3, 2) DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    completed_jobs INTEGER DEFAULT 0,
    service_location VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    base_price DECIMAL(10, 2),
    duration_hours INTEGER,
    image_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE worker_services (
    id SERIAL PRIMARY KEY,
    worker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    price DECIMAL(10, 2) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE bookings (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    worker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE, 
    booking_date TIMESTAMP NOT NULL,
    start_time TIME,
    end_time TIME,
    duration_hours INTEGER,
    total_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
    address TEXT NOT NULL,
    special_instructions TEXT,
    payment_status VARCHAR(50) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    cancelled_by VARCHAR(50),
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP,
    previous_status VARCHAR(50),
    status_changed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE SET NULL,
    reviewer_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    reviewee_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE saved_workers (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    worker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, worker_id)
);


CREATE TABLE saved_clients (
    id SERIAL PRIMARY KEY,
    worker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(worker_id, client_id)
);


CREATE TABLE IF NOT EXISTS email_otps (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    code VARCHAR(10) NOT NULL,
    purpose VARCHAR(50) NOT NULL,
    consumed BOOLEAN DEFAULT FALSE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);


CREATE TABLE IF NOT EXISTS job_requests (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    worker_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    requested_date TIMESTAMP NOT NULL,
    preferred_time VARCHAR(50),
    budget DECIMAL(10, 2),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'in_progress', 'completed', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_worker_profiles_updated_at BEFORE UPDATE ON worker_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_requests_updated_at BEFORE UPDATE ON job_requests FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


-- INSERT INTO services (name, category, description, base_price, duration_hours) VALUES
-- ('Plumber', 'Home Maintenance', 'Fixing leaks, pipes, and installing fixtures', 50.00, 1),
-- ('Electrician', 'Home Maintenance', 'Electrical wiring, repairs, and installations', 60.00, 1),
-- ('Cleaner', 'Cleaning', 'Standard home cleaning service', 30.00, 2),
-- ('Carpenter', 'Home Maintenance', 'Woodwork, furniture repair, and custom builds', 55.00, 3),
-- ('Gardener', 'Outdoor', 'Lawn mowing, trimming, and garden maintenance', 40.00, 2),
-- ('Painter', 'Home Improvement', 'Interior and exterior painting', 45.00, 4),
-- ('Mover', 'Moving', 'Help with moving boxes and furniture', 35.00, 2),
-- ('Mechanic', 'Automotive', 'Basic car repair and maintenance', 70.00, 1),
-- ('AC Technician', 'Home Maintenance', 'Air conditioner repair and service', 65.00, 1),
-- ('Pest Control', 'Home Maintenance', 'Pest inspection and extermination', 80.00, 1),
-- ('Handyman', 'Home Maintenance', 'General repairs and small jobs', 45.00, 2),
-- ('Roofer', 'Home Improvement', 'Roof repairs and installation', 75.00, 4),
-- ('Flooring Specialist', 'Home Improvement', 'Installation and repair of flooring', 60.00, 3),
-- ('Welder', 'Construction', 'Metal work and welding repairs', 85.00, 2),
-- ('Tiler', 'Home Improvement', 'Tile installation for floors and walls', 50.00, 3),
-- ('Pool Cleaner', 'Outdoor', 'Swimming pool cleaning and maintenance', 55.00, 2),
-- ('Locksmith', 'Home Security', 'Lock installation and emergency lockout services', 90.00, 1)
-- ON CONFLICT DO NOTHING;


-- INSERT INTO users (name, email, password, role, phone, is_verified) VALUES
-- ('Admin User', 'admin@quickstaff.com', '$2a$10$X.v.v.v.v.v.v.v.v.v.v.u123456hashedpasswordplaceholder', 'admin', '0000000000', TRUE)
-- ON CONFLICT (email) DO NOTHING;


-- INSERT INTO users (name, email, password, role, phone, is_verified) VALUES
-- ('John Plumber', 'john@worker.com', '$2a$10$X.v.v.v.v.v.v.v.v.v.v.u123456hashedpasswordplaceholder', 'worker', '1234567890', TRUE),
-- ('Sarah Cleaner', 'sarah@worker.com', '$2a$10$X.v.v.v.v.v.v.v.v.v.v.u123456hashedpasswordplaceholder', 'worker', '0987654321', TRUE)
-- ON CONFLICT (email) DO NOTHING;


-- INSERT INTO users (name, email, password, role, phone, is_verified) VALUES
-- ('Alice Client', 'alice@client.com', '$2a$10$X.v.v.v.v.v.v.v.v.v.v.u123456hashedpasswordplaceholder', 'client', '1122334455', TRUE)
-- ON CONFLICT (email) DO NOTHING;


-- INSERT INTO worker_profiles (user_id, title, bio, skills, hourly_rate, service_location, rating, total_reviews)
-- SELECT id, 'Plumber', 'Expert plumber with 10 years experience.', ARRAY['Plumbing', 'Pipe Fitting'], 50.00, 'New York', 4.8, 12
-- FROM users WHERE email = 'john@worker.com';

-- INSERT INTO worker_profiles (user_id, title, bio, skills, hourly_rate, service_location, rating, total_reviews)
-- SELECT id, 'Cleaner', 'Professional cleaner using eco-friendly products.', ARRAY['Deep Cleaning', 'Organization'], 30.00, 'Brooklyn', 4.9, 25
-- FROM users WHERE email = 'sarah@worker.com';
