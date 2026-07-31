package com.construction.management;

import com.construction.management.entity.*;
import com.construction.management.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MaterialRepository materialRepository;
    private final SupplierRepository supplierRepository;
    private final PurchaseRepository purchaseRepository;
    private final UsageRecordRepository usageRecordRepository;
    private final ExpenseRepository expenseRepository;
    private final ProjectRepository projectRepository;

    @Override
    public void run(String... args) {
        createUser("admin",        "admin123",    User.Role.ADMIN);
        createUser("engineer",     "engineer123", User.Role.ENGINEER);
        createUser("storemanager", "store123",    User.Role.STORE_MANAGER);
        seedMaterials();
        seedSuppliers();
        seedPurchases();
        seedUsage();
        seedExpenses();
        seedProjects();
    }

    private void createUser(String username, String password, User.Role role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User u = new User();
            u.setUsername(username);
            u.setPassword(passwordEncoder.encode(password));
            u.setRole(role);
            userRepository.save(u);
        }
    }

    // ── MATERIALS ──────────────────────────────────────────────────────────────
    private void seedMaterials() {
        if (materialRepository.count() > 0) return;
        saveMat("Cement (OPC 53)",        "Binding",    1200, 8.50,  "UltraTech Cement",  200);
        saveMat("Steel Bars (TMT 12mm)",  "Steel",       850, 55.00, "TATA Steel",        150);
        saveMat("River Sand",             "Aggregate",   600, 12.00, "Local Quarry",      100);
        saveMat("Crushed Stone (20mm)",   "Aggregate",   750, 10.00, "Granite Suppliers", 120);
        saveMat("Red Bricks",             "Masonry",    5000,  0.45, "City Brick Works",  800);
        saveMat("AAC Blocks",             "Masonry",    3200,  1.20, "Siporex India",     500);
        saveMat("Plywood (18mm)",         "Wood",        180, 35.00, "Century Plyboards",  30);
        saveMat("Binding Wire",           "Steel",        90,  2.50, "Wire Industries",    50);
        saveMat("PVC Pipes (4 inch)",     "Plumbing",    320, 18.00, "Finolex Pipes",      60);
        saveMat("Ceramic Tiles (2x2)",    "Finishing",  2400, 22.00, "Kajaria Ceramics",  400);
        saveMat("White Cement",           "Finishing",   150, 14.00, "JK White Cement",    80);
        saveMat("Waterproofing Compound", "Chemical",     95, 28.00, "Dr. Fixit",          40);
        saveMat("Electrical Conduit",     "Electrical",  410,  6.50, "Havells India",      80);
        saveMat("MS Channels (100mm)",    "Steel",       220, 72.00, "JSW Steel",          50);
        saveMat("Granite Slabs",          "Finishing",   180, 95.00, "Rajasthan Granites", 30);
        System.out.println("Seeded 15 materials.");
    }

    private void saveMat(String name, String cat, int qty, double price, String supplier, int minStock) {
        Material m = new Material();
        m.setMaterialName(name); m.setCategory(cat); m.setQuantity(qty);
        m.setPrice(price); m.setSupplier(supplier); m.setMinStock(minStock);
        materialRepository.save(m);
    }

    // ── SUPPLIERS ──────────────────────────────────────────────────────────────
    private void seedSuppliers() {
        if (supplierRepository.count() > 0) return;
        saveSupplier("UltraTech Cement",   "9876543210", "Mumbai, Maharashtra");
        saveSupplier("TATA Steel",         "9123456780", "Jamshedpur, Jharkhand");
        saveSupplier("Local Quarry",       "9988776655", "Pune, Maharashtra");
        saveSupplier("Granite Suppliers",  "9871234560", "Bengaluru, Karnataka");
        saveSupplier("City Brick Works",   "9765432100", "Hyderabad, Telangana");
        saveSupplier("Siporex India",      "9654321098", "Chennai, Tamil Nadu");
        saveSupplier("Century Plyboards",  "9543210987", "Kolkata, West Bengal");
        saveSupplier("Finolex Pipes",      "9432109876", "Pune, Maharashtra");
        saveSupplier("Kajaria Ceramics",   "9321098765", "New Delhi");
        saveSupplier("Havells India",      "9210987654", "Noida, Uttar Pradesh");
        System.out.println("Seeded 10 suppliers.");
    }

    private void saveSupplier(String name, String phone, String address) {
        Supplier s = new Supplier();
        s.setSupplierName(name); s.setPhone(phone); s.setAddress(address);
        supplierRepository.save(s);
    }

    // ── PURCHASES ─────────────────────────────────────────────────────────────
    private void seedPurchases() {
        if (purchaseRepository.count() > 0) return;
        List<Material> mats = materialRepository.findAll();
        if (mats.size() < 5) return;
        savePurchase(mats.get(0), 500, 4250.00,  LocalDate.now().minusDays(30));
        savePurchase(mats.get(1), 200, 11000.00, LocalDate.now().minusDays(25));
        savePurchase(mats.get(2), 300, 3600.00,  LocalDate.now().minusDays(20));
        savePurchase(mats.get(4), 2000, 900.00,  LocalDate.now().minusDays(15));
        savePurchase(mats.get(0), 300, 2550.00,  LocalDate.now().minusDays(10));
        savePurchase(mats.get(3), 400, 4000.00,  LocalDate.now().minusDays(8));
        savePurchase(mats.get(9), 500, 11000.00, LocalDate.now().minusDays(5));
        savePurchase(mats.get(6), 50,  1750.00,  LocalDate.now().minusDays(3));
        System.out.println("Seeded 8 purchases.");
    }

    private void savePurchase(Material mat, int qty, double cost, LocalDate date) {
        Purchase p = new Purchase();
        p.setMaterial(mat); p.setQuantity(qty); p.setTotalCost(cost); p.setPurchaseDate(date);
        purchaseRepository.save(p);
    }

    // ── USAGE ─────────────────────────────────────────────────────────────────
    private void seedUsage() {
        if (usageRecordRepository.count() > 0) return;
        List<Material> mats = materialRepository.findAll();
        if (mats.size() < 5) return;
        saveUsage(mats.get(0), 150, "Skyline Residency Block A",  LocalDate.now().minusDays(28));
        saveUsage(mats.get(1), 80,  "Skyline Residency Block A",  LocalDate.now().minusDays(26));
        saveUsage(mats.get(2), 200, "Skyline Residency Block A",  LocalDate.now().minusDays(24));
        saveUsage(mats.get(4), 1000,"City Mall Foundation",       LocalDate.now().minusDays(20));
        saveUsage(mats.get(0), 100, "City Mall Foundation",       LocalDate.now().minusDays(18));
        saveUsage(mats.get(3), 300, "City Mall Foundation",       LocalDate.now().minusDays(15));
        saveUsage(mats.get(5), 500, "Green Valley Villas",        LocalDate.now().minusDays(12));
        saveUsage(mats.get(9), 800, "Green Valley Villas",        LocalDate.now().minusDays(8));
        saveUsage(mats.get(1), 50,  "Highway Bridge Repair",      LocalDate.now().minusDays(5));
        saveUsage(mats.get(6), 30,  "Highway Bridge Repair",      LocalDate.now().minusDays(2));
        System.out.println("Seeded 10 usage records.");
    }

    private void saveUsage(Material mat, int qty, String project, LocalDate date) {
        UsageRecord u = new UsageRecord();
        u.setMaterial(mat); u.setUsedQuantity(qty); u.setProjectName(project); u.setUsedDate(date);
        usageRecordRepository.save(u);
    }

    // ── EXPENSES ──────────────────────────────────────────────────────────────
    private void seedExpenses() {
        if (expenseRepository.count() > 0) return;
        saveExpense("Cement & Steel purchase – Block A",    45000.00, "MATERIAL",  "Skyline Residency Block A", LocalDate.now().minusDays(29));
        saveExpense("Mason labour – foundation work",       18000.00, "LABOUR",    "Skyline Residency Block A", LocalDate.now().minusDays(22));
        saveExpense("Truck transport – sand & aggregate",    6500.00, "TRANSPORT", "City Mall Foundation",      LocalDate.now().minusDays(19));
        saveExpense("Bricks & AAC blocks purchase",         32000.00, "MATERIAL",  "City Mall Foundation",      LocalDate.now().minusDays(16));
        saveExpense("Electrician labour – conduit laying",  12000.00, "LABOUR",    "Green Valley Villas",       LocalDate.now().minusDays(11));
        saveExpense("Tiles & granite purchase",             55000.00, "MATERIAL",  "Green Valley Villas",       LocalDate.now().minusDays(7));
        saveExpense("Crane rental – steel erection",        9500.00,  "OTHER",     "Highway Bridge Repair",     LocalDate.now().minusDays(4));
        saveExpense("Waterproofing treatment",               7200.00, "MATERIAL",  "Highway Bridge Repair",     LocalDate.now().minusDays(1));
        System.out.println("Seeded 8 expenses.");
    }

    private void saveExpense(String desc, double amount, String category, String project, LocalDate date) {
        Expense e = new Expense();
        e.setDescription(desc); e.setAmount(amount); e.setCategory(category);
        e.setProjectName(project); e.setExpenseDate(date);
        expenseRepository.save(e);
    }

    // ── PROJECTS ──────────────────────────────────────────────────────────────
    private void seedProjects() {
        if (projectRepository.count() > 0) return;
        saveProject("Skyline Residency Block A", "Andheri West, Mumbai",   "engineer", LocalDate.now().minusDays(60), LocalDate.now().plusDays(120), 45, "ACTIVE");
        saveProject("City Mall Foundation",      "Bandra East, Mumbai",    "engineer", LocalDate.now().minusDays(45), LocalDate.now().plusDays(90),  60, "ACTIVE");
        saveProject("Green Valley Villas",       "Pune, Maharashtra",      "engineer", LocalDate.now().minusDays(30), LocalDate.now().plusDays(180), 25, "ACTIVE");
        saveProject("Highway Bridge Repair",     "Nashik Highway, MH",     "engineer", LocalDate.now().minusDays(20), LocalDate.now().plusDays(40),  80, "ACTIVE");
        saveProject("Old Warehouse Renovation",  "Thane, Maharashtra",     "engineer", LocalDate.now().minusDays(90), LocalDate.now().minusDays(5),  100, "COMPLETED");
        System.out.println("Seeded 5 projects.");
    }

    private void saveProject(String name, String location, String engineer,
                             LocalDate start, LocalDate end, int progress, String status) {
        Project p = new Project();
        p.setProjectName(name); p.setLocation(location); p.setEngineer(engineer);
        p.setStartDate(start); p.setEndDate(end); p.setProgress(progress); p.setStatus(status);
        projectRepository.save(p);
    }
}
