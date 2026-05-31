UPDATE system_services
SET endpoint = 'https://stockcerdas.streamlit.app/',
    status = 'online',
    updated_at = NOW()
WHERE service_name = 'Dashboard Data';

UPDATE system_services
SET endpoint = '/api/import/health',
    status = 'online',
    updated_at = NOW()
WHERE service_name = 'Import Worker';
