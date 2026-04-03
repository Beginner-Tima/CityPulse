-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: zones
CREATE TABLE zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT
);

-- Table: metrics_log
CREATE TABLE metrics_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    pm25_level FLOAT NOT NULL,
    traffic_speed FLOAT NOT NULL
);

-- Table: ai_insights
CREATE TABLE ai_insights (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zone_id UUID REFERENCES zones(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    severity TEXT CHECK (severity IN ('low', 'med', 'high', 'critical')) NOT NULL,
    summary TEXT NOT NULL,
    action_plan JSONB NOT NULL
);

-- Insert zones
INSERT INTO zones (name, description) VALUES
    ('Alatau District', 'Southern residential area with high vegetation'),
    ('Bostandyk District', 'Central business district with heavy traffic'),
    ('Medeu District', 'Mountain area with tourism activity');

-- Create indexes
CREATE INDEX idx_metrics_zone_time ON metrics_log(zone_id, created_at DESC);
CREATE INDEX idx_insights_zone ON ai_insights(zone_id);
CREATE INDEX idx_insights_created ON ai_insights(created_at DESC);
