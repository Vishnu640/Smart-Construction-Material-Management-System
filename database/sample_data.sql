USE construction_management;

INSERT INTO suppliers (supplier_name, phone, address) VALUES
('ABC Traders', '9876543210', 'Mumbai, Maharashtra'),
('XYZ Suppliers', '9123456780', 'Delhi, India'),
('PQR Enterprises', '9988776655', 'Chennai, Tamil Nadu'),
('Steel World', '9871234560', 'Pune, Maharashtra'),
('Sand Stone Co', '9765432100', 'Hyderabad, Telangana');

INSERT INTO materials (material_name, category, quantity, price, supplier) VALUES
('Cement (OPC 53)', 'Binding Material', 850, 5.50, 'ABC Traders'),
('TMT Steel Bars', 'Metal', 1200, 65.00, 'Steel World'),
('Red Bricks', 'Masonry', 5000, 0.80, 'PQR Enterprises'),
('River Sand', 'Aggregate', 300, 12.00, 'Sand Stone Co'),
('Coarse Aggregate', 'Aggregate', 420, 10.00, 'Sand Stone Co'),
('Ceramic Tiles', 'Flooring', 80, 25.00, 'XYZ Suppliers'),
('PVC Pipes (4 inch)', 'Plumbing', 150, 18.00, 'ABC Traders'),
('Paint (White)', 'Finishing', 60, 30.00, 'XYZ Suppliers'),
('Plywood Sheets', 'Wood', 200, 45.00, 'PQR Enterprises'),
('Glass Panels', 'Glazing', 90, 120.00, 'XYZ Suppliers'),
('Marble Flooring', 'Flooring', 40, 200.00, 'PQR Enterprises'),
('Electrical Wires', 'Electrical', 500, 8.00, 'ABC Traders');

INSERT INTO purchases (material_id, quantity, total_cost, purchase_date) VALUES
(1, 500, 2750.00, '2026-06-01'),
(2, 800, 52000.00, '2026-06-03'),
(3, 3000, 2400.00, '2026-06-05'),
(4, 200, 2400.00, '2026-06-08'),
(5, 300, 3000.00, '2026-06-10'),
(1, 350, 1925.00, '2026-06-15'),
(6, 100, 2500.00, '2026-06-18'),
(7, 150, 2700.00, '2026-06-20'),
(2, 400, 26000.00, '2026-07-01'),
(8, 80, 2400.00, '2026-07-05'),
(9, 200, 9000.00, '2026-07-08'),
(10, 90, 10800.00, '2026-07-10'),
(1, 200, 1100.00, '2026-07-15'),
(3, 2000, 1600.00, '2026-07-18'),
(12, 500, 4000.00, '2026-07-20');

INSERT INTO usage_records (material_id, used_quantity, used_date, project_name) VALUES
(1, 100, '2026-06-10', 'Apartment Block A'),
(2, 200, '2026-06-12', 'Apartment Block A'),
(3, 500, '2026-06-14', 'Apartment Block A'),
(4, 50, '2026-06-16', 'Commercial Complex'),
(5, 80, '2026-06-18', 'Commercial Complex'),
(1, 150, '2026-06-22', 'Villa Project'),
(2, 300, '2026-06-25', 'Villa Project'),
(6, 20, '2026-07-02', 'Apartment Block B'),
(7, 30, '2026-07-04', 'Apartment Block B'),
(1, 200, '2026-07-08', 'Bridge Construction'),
(2, 400, '2026-07-10', 'Bridge Construction'),
(3, 1000, '2026-07-12', 'Bridge Construction'),
(8, 20, '2026-07-15', 'Villa Project'),
(9, 50, '2026-07-18', 'Commercial Complex'),
(12, 100, '2026-07-20', 'Apartment Block A');

INSERT INTO expenses (description, amount, expense_date) VALUES
('Labour Wages - June Week 1', 8500.00, '2026-06-07'),
('Equipment Rental - Crane', 5000.00, '2026-06-10'),
('Transport - Material Delivery', 1200.00, '2026-06-12'),
('Labour Wages - June Week 2', 8500.00, '2026-06-14'),
('Site Safety Equipment', 2300.00, '2026-06-18'),
('Labour Wages - June Week 3', 8500.00, '2026-06-21'),
('Concrete Mixer Fuel', 900.00, '2026-06-24'),
('Labour Wages - June Week 4', 8500.00, '2026-06-28'),
('Labour Wages - July Week 1', 9000.00, '2026-07-05'),
('Equipment Rental - Excavator', 6500.00, '2026-07-08'),
('Transport - Material Delivery', 1500.00, '2026-07-10'),
('Labour Wages - July Week 2', 9000.00, '2026-07-12'),
('Site Office Expenses', 1800.00, '2026-07-15'),
('Labour Wages - July Week 3', 9000.00, '2026-07-19'),
('Scaffolding Rental', 3200.00, '2026-07-22');
