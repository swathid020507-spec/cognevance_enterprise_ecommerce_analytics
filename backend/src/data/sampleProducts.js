/**
 * Curated sample enterprise e-commerce products
 * Serves as database seed data and in-memory fallback
 */
const sampleProducts = [
  {
    id: 'prod-001',
    name: 'Enterprise Rack Server Pro X9',
    description: 'High-density 2U dual-socket enterprise server engineered for demanding AI workloads, virtualization, and hybrid cloud infrastructures. Features dual Intel Xeon processors, 256GB ECC RAM, and redundant titanium-grade power supplies.',
    price: 2899.99,
    category: 'Servers & Cloud',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    countInStock: 14,
    rating: 4.9,
    numReviews: 28,
    isFeatured: true
  },
  {
    id: 'prod-002',
    name: 'Quantum Core Workstation X1',
    description: 'Ultra-performance enterprise workstation with liquid cooling, dedicated AI tensor cores, 64-core processing, and certified ISV reliability for engineering simulations and data science pipelines.',
    price: 3499.00,
    category: 'Workstations',
    image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&w=800&q=80',
    countInStock: 8,
    rating: 4.8,
    numReviews: 19,
    isFeatured: true
  },
  {
    id: 'prod-003',
    name: 'UltraWide 40" 5K Thunderbolt Display',
    description: 'Curved 5120x2160 IPS Black display with 98% DCI-P3 color gamut, integrated Thunderbolt 4 hub, 96W power delivery, and dual-source KVM switch for executive workstations.',
    price: 1199.50,
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80',
    countInStock: 22,
    rating: 4.7,
    numReviews: 43,
    isFeatured: true
  },
  {
    id: 'prod-004',
    name: 'Cognevance BI & Real-time Analytics Suite',
    description: 'Annual enterprise tier license with unlimited dashboards, automated anomaly detection, streaming event ingestion, role-based governance, and SOC-2 compliance reporting.',
    price: 799.00,
    category: 'Enterprise Software',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    countInStock: 999,
    rating: 5.0,
    numReviews: 64,
    isFeatured: true
  },
  {
    id: 'prod-005',
    name: 'SecureEdge NextGen Firewall Gateway',
    description: 'Hardware threat mitigation appliance delivering 40 Gbps deep-packet inspection, zero-trust network access (ZTNA), automated intrusion prevention, and TLS 1.3 decryption at line rate.',
    price: 1550.00,
    category: 'Networking',
    image: 'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=800&q=80',
    countInStock: 12,
    rating: 4.6,
    numReviews: 15,
    isFeatured: false
  },
  {
    id: 'prod-006',
    name: 'Enterprise NVMe U.2 SSD 7.68TB',
    description: 'PCIe Gen 4 enterprise solid-state drive with power-loss data protection, 1.3M random read IOPS, 7,000 MB/s sustained throughput, and 5-year end-to-end data path endurance.',
    price: 649.99,
    category: 'Storage',
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?auto=format&fit=crop&w=800&q=80',
    countInStock: 35,
    rating: 4.9,
    numReviews: 31,
    isFeatured: false
  },
  {
    id: 'prod-007',
    name: 'ErgoTech Executive Mesh Office Chair',
    description: 'Commercial-grade ergonomic chair with 4D dynamic lumbar tracking, breathable Italian mesh, multi-angle synchro-tilt lock, and 300-pound continuous rating for 24/7 command centers.',
    price: 489.00,
    category: 'Office & Ergonomics',
    image: 'https://images.unsplash.com/photo-1580481077195-c3a821a58875?auto=format&fit=crop&w=800&q=80',
    countInStock: 19,
    rating: 4.8,
    numReviews: 52,
    isFeatured: false
  },
  {
    id: 'prod-008',
    name: 'Tactile Wireless Mechanical Developer Deck',
    description: 'Hot-swappable custom-tuned mechanical keyboard with CNC aluminum chassis, QMK/VIA programmable firmware, tri-mode wireless latency below 1ms, and sound-dampening silicone gaskets.',
    price: 219.00,
    category: 'Peripherals',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?auto=format&fit=crop&w=800&q=80',
    countInStock: 45,
    rating: 4.7,
    numReviews: 76,
    isFeatured: false
  }
];

module.exports = sampleProducts;
