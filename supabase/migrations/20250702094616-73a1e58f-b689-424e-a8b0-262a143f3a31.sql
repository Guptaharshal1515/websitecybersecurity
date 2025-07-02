-- Update harshalguptacoc@gmail.com role to editor
UPDATE public.profiles 
SET role = 'editor'::user_role 
WHERE username = 'harshalguptacoc@gmail.com';

-- Add more cybersecurity certificates
INSERT INTO public.certificates (title, description, image_url, certificate_url, type, display_order) VALUES
('CISSP - Certified Information Systems Security Professional', 'Advanced cybersecurity certification covering security and risk management, asset security, security architecture and engineering.', '/placeholder.svg', 'https://example.com/cissp', 'cybersecurity', 4),
('CISM - Certified Information Security Manager', 'Management-level certification focusing on information security strategy, governance, and risk management.', '/placeholder.svg', 'https://example.com/cism', 'cybersecurity', 5),
('AWS Security Specialty', 'Cloud security certification demonstrating expertise in securing the AWS platform and workloads.', '/placeholder.svg', 'https://example.com/aws-security', 'cybersecurity', 6),
('GCIH - GIAC Certified Incident Handler', 'Hands-on certification for incident handling, computer forensics, and hacker techniques.', '/placeholder.svg', 'https://example.com/gcih', 'cybersecurity', 7),
('OSCP - Offensive Security Certified Professional', 'Practical penetration testing certification requiring hands-on exploitation of vulnerable machines.', '/placeholder.svg', 'https://example.com/oscp', 'cybersecurity', 8),
('CySA+ - CompTIA Cybersecurity Analyst', 'Intermediate-level certification focusing on threat detection, analysis, and response using tools and techniques.', '/placeholder.svg', 'https://example.com/cysa', 'cybersecurity', 9);