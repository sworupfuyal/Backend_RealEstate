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

    res.status(201).json(newProperty); // Send the newly created property as a response
  } catch (err) {
    console.error('Error adding property:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getProperties = async (req, res) => {
  try {
    // Fetch only properties where propertyType is 'sell'
    const forSaleProperties = await Property.findAll({
      where: {
        propertyType: 'sell',
      },
    });

    if (forSaleProperties.length === 0) {
      return res.status(404).json({ message: 'No properties available for sale.' });
    }

    res.status(200).json(forSaleProperties); // Send the properties that are for sale
  } catch (err) {
    console.error("Error fetching properties:", err.message);
    res.status(500).json({ error: "Server error" });
  }
};

