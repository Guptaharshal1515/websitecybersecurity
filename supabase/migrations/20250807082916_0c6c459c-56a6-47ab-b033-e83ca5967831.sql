-- Drop additional_certificates table completely
DROP TABLE IF EXISTS additional_certificates CASCADE;

-- Add dummy achievements data for showcase
INSERT INTO achievements (title, description, image_url, certificate_url, achievement_type, upload_date, display_order) VALUES
('AWS Cloud Practitioner Certification', 'Fundamental understanding of AWS Cloud services and infrastructure management', '/lovable-uploads/4fd38dbb-e500-4086-a881-7b783d6ec747.png', 'https://example.com/aws-cert', 'Cloud Computing', '2024-01-15', 1),
('Python Data Science Bootcamp', 'Completed intensive 12-week bootcamp covering pandas, numpy, matplotlib, and machine learning fundamentals', '/lovable-uploads/4fd38dbb-e500-4086-a881-7b783d6ec747.png', 'https://example.com/python-cert', 'Programming', '2024-02-20', 2),
('Google Analytics Individual Qualification', 'Certified in Google Analytics implementation, configuration, and advanced reporting', '/lovable-uploads/4fd38dbb-e500-4086-a881-7b783d6ec747.png', 'https://example.com/ga-cert', 'Digital Marketing', '2024-03-10', 3),
('React Advanced Patterns Workshop', 'Advanced React patterns including hooks, context, and performance optimization techniques', '/lovable-uploads/4fd38dbb-e500-4086-a881-7b783d6ec747.png', 'https://example.com/react-cert', 'Frontend Development', '2024-04-05', 4),
('Agile Project Management Certificate', 'Scrum methodology, sprint planning, and team collaboration in agile environments', '/lovable-uploads/4fd38dbb-e500-4086-a881-7b783d6ec747.png', 'https://example.com/agile-cert', 'Project Management', '2024-05-12', 5);