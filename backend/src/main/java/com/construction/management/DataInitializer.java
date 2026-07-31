package com.construction.management;

import com.construction.management.entity.Material;
import com.construction.management.entity.User;
import com.construction.management.repository.MaterialRepository;
import com.construction.management.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final MaterialRepository materialRepository;

    @Override
    public void run(String... args) {
        createUser("admin", "admin123", User.Role.ADMIN);
        createUser("engineer", "engineer123", User.Role.ENGINEER);
        createUser("storemanager", "store123", User.Role.STORE_MANAGER);
        seedMaterials();
    }

    private void createUser(String username, String password, User.Role role) {
        if (userRepository.findByUsername(username).isEmpty()) {
            User user = new User();
            user.setUsername(username);
            user.setPassword(passwordEncoder.encode(password));
            user.setRole(role);
            userRepository.save(user);
        }
    }

    private void seedMaterials() {
        if (materialRepository.count() > 0) return;
        save("Cement (OPC 53)",          "Binding",    1200, 8.50,  "UltraTech Cement",   200);
        save("Steel Bars (TMT 12mm)",    "Steel",       850, 55.00, "TATA Steel",         150);
        save("River Sand",               "Aggregate",   600, 12.00, "Local Quarry",       100);
        save("Crushed Stone (20mm)",     "Aggregate",   750, 10.00, "Granite Suppliers",  120);
        save("Red Bricks",               "Masonry",    5000,  0.45, "City Brick Works",   800);
        save("AAC Blocks",               "Masonry",    3200,  1.20, "Siporex India",      500);
        save("Plywood (18mm)",           "Wood",        180, 35.00, "Century Plyboards",   30);
        save("Binding Wire",             "Steel",        90,  2.50, "Wire Industries",     50);
        save("PVC Pipes (4 inch)",       "Plumbing",    320, 18.00, "Finolex Pipes",       60);
        save("Ceramic Tiles (2x2)",      "Finishing",  2400, 22.00, "Kajaria Ceramics",   400);
        save("White Cement",             "Finishing",   150, 14.00, "JK White Cement",     80);
        save("Waterproofing Compound",   "Chemical",     95, 28.00, "Dr. Fixit",           40);
        save("Electrical Conduit",       "Electrical",  410,  6.50, "Havells India",       80);
        save("MS Channels (100mm)",      "Steel",       220, 72.00, "JSW Steel",           50);
        save("Granite Slabs",            "Finishing",   180, 95.00, "Rajasthan Granites",  30);
        System.out.println("Seeded 15 sample materials.");
    }

    private void save(String name, String category, int qty, double price, String supplier, int minStock) {
        Material m = new Material();
        m.setMaterialName(name);
        m.setCategory(category);
        m.setQuantity(qty);
        m.setPrice(price);
        m.setSupplier(supplier);
        m.setMinStock(minStock);
        materialRepository.save(m);
    }
}
