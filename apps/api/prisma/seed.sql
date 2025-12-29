-- =============================================
-- DCMS Database Seed Script
-- Database: dental-clinic
-- Run this AFTER running: npx prisma migrate dev
-- =============================================

-- =============================================
-- USERS (password for all users: "password123")
-- Hash generated with bcrypt, 10 salt rounds
-- =============================================

-- Admin user
INSERT INTO users (username, passwordhash, role, isdeleted, tokenversion) 
VALUES ('admin', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'ADMIN', false, 0);

-- Doctor users
INSERT INTO users (username, passwordhash, role, isdeleted, tokenversion) 
VALUES ('doctor1', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'DOCTOR', false, 0);

INSERT INTO users (username, passwordhash, role, isdeleted, tokenversion) 
VALUES ('doctor2', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'DOCTOR', false, 0);

-- Receptionist user
INSERT INTO users (username, passwordhash, role, isdeleted, tokenversion) 
VALUES ('receptionist', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'RECEPTIONIST', false, 0);

-- Pharmacist user
INSERT INTO users (username, passwordhash, role, isdeleted, tokenversion) 
VALUES ('pharmacist', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'PHARMACIST', false, 0);

-- Assistant user
INSERT INTO users (username, passwordhash, role, isdeleted, tokenversion) 
VALUES ('assistant', '$2b$10$EpRnTzVlqHNP0.fUbXUwSOyuiXe/QLSUG6xNekdHgTGmrpHEfIoxm', 'ASSISTANT', false, 0);

-- =============================================
-- DOCTORS (linked to doctor users)
-- =============================================

INSERT INTO doctors (userid, name, specialization, phone, email, isdeleted)
VALUES (2, 'Dr. Arshad Khan', 'Orthodontics', '+92-300-1234567', 'arshad@oradent.com', false);

INSERT INTO doctors (userid, name, specialization, phone, email, isdeleted)
VALUES (3, 'Dr. Sara Ahmed', 'General Dentistry', '+92-300-7654321', 'sara@oradent.com', false);

-- =============================================
-- RECEPTIONISTS
-- =============================================

INSERT INTO receptionists (userid, name, phone, isdeleted)
VALUES (4, 'Fatima Ali', '+92-321-1111111', false);

-- =============================================
-- PHARMACISTS
-- =============================================

INSERT INTO pharmacists (userid, name, phone, isdeleted)
VALUES (5, 'Hassan Raza', '+92-321-2222222', false);

-- =============================================
-- ASSISTANTS (linked to a doctor)
-- =============================================

INSERT INTO assistants (userid, doctorid, name, phone, isdeleted)
VALUES (6, 1, 'Ayesha Malik', '+92-321-3333333', false);

-- =============================================
-- PATIENTS
-- =============================================

INSERT INTO patients (name, dateofbirth, gender, phone, address, medicalhistory, isdeleted)
VALUES ('Zahid Khan', '1990-05-15', 'Male', '+92-321-9876543', 'Lahore, Pakistan', 'No allergies', false);

INSERT INTO patients (name, dateofbirth, gender, phone, address, medicalhistory, isdeleted)
VALUES ('Mariam Bibi', '1985-08-22', 'Female', '+92-333-1234567', 'Islamabad, Pakistan', 'Diabetic', false);

INSERT INTO patients (name, dateofbirth, gender, phone, address, medicalhistory, isdeleted)
VALUES ('Ahmed Ali', '2000-01-10', 'Male', '+92-345-9999999', 'Karachi, Pakistan', 'None', false);

-- =============================================
-- MEDICINES
-- =============================================

INSERT INTO medicines (name, quantity, price, availabilitystatus, isdeleted)
VALUES ('Amoxicillin 500mg', 100, 450.00, true, false);

INSERT INTO medicines (name, quantity, price, availabilitystatus, isdeleted)
VALUES ('Ibuprofen 400mg', 5, 200.00, true, false);

INSERT INTO medicines (name, quantity, price, availabilitystatus, isdeleted)
VALUES ('Metronidazole 400mg', 75, 350.00, true, false);

INSERT INTO medicines (name, quantity, price, availabilitystatus, isdeleted)
VALUES ('Paracetamol 500mg', 200, 100.00, true, false);

INSERT INTO medicines (name, quantity, price, availabilitystatus, isdeleted)
VALUES ('Chlorhexidine Mouthwash', 30, 550.00, true, false);

-- =============================================
-- TREATMENTS
-- =============================================

INSERT INTO treatments (patientid, name, description, status, startdate, isdeleted)
VALUES (1, 'Root Canal Treatment', 'Root canal on upper left molar', 'Active', NOW(), false);

INSERT INTO treatments (patientid, name, description, status, startdate, isdeleted)
VALUES (2, 'Teeth Whitening', 'Professional whitening treatment', 'Completed', NOW() - INTERVAL '30 days', false);

INSERT INTO treatments (patientid, name, description, status, startdate, isdeleted)
VALUES (1, 'Dental Crown', 'Ceramic crown fitting', 'Pending', NULL, false);

-- =============================================
-- APPOINTMENTS
-- =============================================

INSERT INTO appointments (patientid, doctorid, receptionistid, treatmentid, appointmenttime, status, notes, isdeleted)
VALUES (1, 1, 1, 1, NOW() + INTERVAL '2 days', 'SCHEDULED', 'Follow-up for root canal', false);

INSERT INTO appointments (patientid, doctorid, receptionistid, treatmentid, appointmenttime, status, notes, isdeleted)
VALUES (2, 2, 1, 2, NOW() - INTERVAL '7 days', 'COMPLETED', 'Whitening completed successfully', false);

INSERT INTO appointments (patientid, doctorid, receptionistid, appointmenttime, status, notes, isdeleted)
VALUES (3, 1, 1, NOW() + INTERVAL '1 day', 'SCHEDULED', 'Initial consultation', false);

-- =============================================
-- BILLING
-- =============================================

INSERT INTO billing (appointmentid, patientid, totalamount, type, paymentstatus, date, isdeleted)
VALUES (2, 2, 15000.00, 'CASH', 'PAID', NOW() - INTERVAL '7 days', false);

INSERT INTO billing (appointmentid, patientid, totalamount, type, paymentstatus, date, isdeleted)
VALUES (1, 1, 25000.00, 'CARD', 'PENDING', NOW(), false);

-- =============================================
-- PRESCRIPTIONS
-- =============================================

INSERT INTO prescriptions (appointmentid, date, notes, isdeleted)
VALUES (2, NOW() - INTERVAL '7 days', 'Post-whitening care instructions', false);

-- =============================================
-- PRESCRIPTION ITEMS
-- =============================================

INSERT INTO prescriptionitems (prescriptionid, medicineid, quantity, dosage)
VALUES (1, 4, 10, 'Take 1 tablet every 6 hours if pain occurs');

INSERT INTO prescriptionitems (prescriptionid, medicineid, quantity, dosage)
VALUES (1, 5, 1, 'Use twice daily for 1 week');

-- =============================================
-- LOGIN CREDENTIALS SUMMARY
-- =============================================
-- All passwords: password123
-- 
-- admin       -> Admin Dashboard
-- doctor1     -> Doctor Dashboard  
-- doctor2     -> Doctor Dashboard
-- receptionist -> Receptionist Dashboard
-- pharmacist  -> Pharmacist Dashboard
-- assistant   -> Assistant Dashboard
-- =============================================
