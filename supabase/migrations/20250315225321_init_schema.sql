-- Create calendar settings table
CREATE TABLE calendar_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    working_hours JSONB NOT NULL DEFAULT '[]',
    buffer_times JSONB NOT NULL DEFAULT '{"defaultBufferBefore": 15, "defaultBufferAfter": 15}',
    booking_rules JSONB NOT NULL DEFAULT '{"minimumNotice": 24, "maximumAdvance": 90}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id)
);

-- Create blackout dates table
CREATE TABLE blackout_dates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, date)
);

-- Create connected calendars table
CREATE TABLE connected_calendars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    calendar_id VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    calendar_email VARCHAR(255),
    calendar_name VARCHAR(255),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, provider, calendar_id)
);

-- Create synced events table
CREATE TABLE synced_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    calendar_id UUID REFERENCES connected_calendars(id) ON DELETE CASCADE,
    event_id VARCHAR(255) NOT NULL,
    summary VARCHAR(255),
    description TEXT,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_all_day BOOLEAN DEFAULT false,
    recurrence_rule TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(calendar_id, event_id)
);

-- Create appointment types table
CREATE TABLE appointment_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL,
    price DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_group BOOLEAN DEFAULT false,
    max_participants INTEGER,
    location_type VARCHAR(20) NOT NULL,
    in_person_location TEXT,
    virtual_meeting_url TEXT,
    color VARCHAR(7),
    is_active BOOLEAN DEFAULT true,
    requires_confirmation BOOLEAN DEFAULT false,
    custom_questions JSONB DEFAULT '[]',
    booking_notice INTEGER DEFAULT 24,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(user_id, slug)
);

-- Create appointment type availability table
CREATE TABLE appointment_type_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    appointment_type_id UUID REFERENCES appointment_types(id) ON DELETE CASCADE,
    day_of_week VARCHAR(9) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
    UNIQUE(appointment_type_id, day_of_week)
);

-- Enable RLS
ALTER TABLE calendar_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE blackout_dates ENABLE ROW LEVEL SECURITY;
ALTER TABLE connected_calendars ENABLE ROW LEVEL SECURITY;
ALTER TABLE synced_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointment_type_availability ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own calendar settings"
    ON calendar_settings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own calendar settings"
    ON calendar_settings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calendar settings"
    ON calendar_settings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own blackout dates"
    ON blackout_dates FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own blackout dates"
    ON blackout_dates FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own blackout dates"
    ON blackout_dates FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own connected calendars"
    ON connected_calendars FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own connected calendars"
    ON connected_calendars FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own connected calendars"
    ON connected_calendars FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own connected calendars"
    ON connected_calendars FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own synced events"
    ON synced_events FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own synced events"
    ON synced_events FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own synced events"
    ON synced_events FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own synced events"
    ON synced_events FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own appointment types"
    ON appointment_types FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own appointment types"
    ON appointment_types FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own appointment types"
    ON appointment_types FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own appointment types"
    ON appointment_types FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their appointment type availability"
    ON appointment_type_availability FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM appointment_types
        WHERE appointment_types.id = appointment_type_availability.appointment_type_id
        AND appointment_types.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their appointment type availability"
    ON appointment_type_availability FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM appointment_types
        WHERE appointment_types.id = appointment_type_availability.appointment_type_id
        AND appointment_types.user_id = auth.uid()
    ));

CREATE POLICY "Users can update their appointment type availability"
    ON appointment_type_availability FOR UPDATE
    USING (EXISTS (
        SELECT 1 FROM appointment_types
        WHERE appointment_types.id = appointment_type_availability.appointment_type_id
        AND appointment_types.user_id = auth.uid()
    ));

CREATE POLICY "Users can delete their appointment type availability"
    ON appointment_type_availability FOR DELETE
    USING (EXISTS (
        SELECT 1 FROM appointment_types
        WHERE appointment_types.id = appointment_type_availability.appointment_type_id
        AND appointment_types.user_id = auth.uid()
    ));

-- Create function for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = TIMEZONE('utc'::text, NOW());
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updating timestamps
CREATE TRIGGER update_calendar_settings_updated_at
    BEFORE UPDATE ON calendar_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_connected_calendars_updated_at
    BEFORE UPDATE ON connected_calendars
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_synced_events_updated_at
    BEFORE UPDATE ON synced_events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointment_types_updated_at
    BEFORE UPDATE ON appointment_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
