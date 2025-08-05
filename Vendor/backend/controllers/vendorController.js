import fs from 'fs-extra';
const vendorPath = './data/vendor.json';

// Register
export const registerVendor = async (req, res) => {
  const { name, email, password, village } = req.body;

  const vendors = await fs.readJson(vendorPath).catch(() => []);
  const existing = vendors.find(v => v.email === email);
  if (existing) return res.status(400).json({ message: "Vendor already exists" });

  vendors.push({ name, email, password, village });
  await fs.writeJson(vendorPath, vendors, { spaces: 2 });

  res.status(201).json({ message: "Vendor registered successfully" });
};

// ✅ Add this for login
export const loginVendor = async (req, res) => {
  const { email, password } = req.body;

  const vendors = await fs.readJson(vendorPath).catch(() => []);
  const vendor = vendors.find(v => v.email === email && v.password === password);

  if (!vendor) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.status(200).json({
    message: "Login successful",
    vendor: { name: vendor.name, village: vendor.village }
  });
};
