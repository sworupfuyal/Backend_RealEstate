const Property = require("../model/Property");

exports.addProperty = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    contactInfo,
    propertyType,
    location,
    price,
    images,
  } = req.body;

  try {
    const newProperty = await Property.create({
      firstName,
      lastName,
      email,
      contactInfo,
      propertyType,
      location,
      price,
      images,
    });

    res.status(201).json(newProperty);
  } catch (err) {
    console.error('Error adding property:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProperties = async (req, res) => {
  try {
    // Assuming you have a where clause implementation in your Property model
    const forSaleProperties = await Property.findAll({
      where: {
        propertyType: 'sell',
      },
    });

    if (forSaleProperties.length === 0) {
      return res.status(404).json({ message: 'No properties available for sale.' });
    }

    res.status(200).json(forSaleProperties);
  } catch (err) {
    console.error("Error fetching properties:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};