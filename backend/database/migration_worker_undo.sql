-- Migration Script: Worker Module Undo Feature
-- Purpose: Add columns to support 60-second undo functionality for job actions
-- Date: 2024-12-13

-- Add previous_status column to store the status before an action (for undo)
-- This allows reverting to the previous state within the 60-second window
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS previous_status VARCHAR(50) DEFAULT NULL;

-- Add status_changed_at column to track when the status was last changed
-- This is used to calculate the 60-second undo window
ALTER TABLE bookings
ADD COLUMN IF NOT EXISTS status_changed_at TIMESTAMP DEFAULT NULL;

-- Add comment for documentation
COMMENT ON COLUMN bookings.previous_status IS 'Stores the status before the last action, used for undo functionality within 60-second window';
COMMENT ON COLUMN bookings.status_changed_at IS 'Timestamp when status was last changed, used to calculate undo window expiry';
