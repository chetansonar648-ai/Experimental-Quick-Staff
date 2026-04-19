-- Migration: Add missing columns to bookings table
-- Run this migration to fix the reschedule booking issue

-- Add start_time and end_time columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS end_time TIME;

-- Add cancellation tracking columns
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_by VARCHAR(50);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancellation_reason TEXT;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMP;

-- Update existing bookings to extract time from booking_date if needed
-- This is optional but helps maintain data consistency
UPDATE bookings 
SET start_time = booking_date::TIME
WHERE start_time IS NULL AND booking_date IS NOT NULL;

-- Note: You can manually update end_time based on start_time + duration_hours
-- Example (commented out):
-- UPDATE bookings 
-- SET end_time = (start_time::INTERVAL + (duration_hours || ' hours')::INTERVAL)::TIME
-- WHERE end_time IS NULL AND start_time IS NOT NULL AND duration_hours IS NOT NULL;
