import EmergencyContact from '../models/EmergencyContact.js';

export const createContact = async (req, res) => {
  try {
    const { name, type, phone, email, address, region, latitude, longitude } = req.body;

    const contact = new EmergencyContact({
      name,
      type,
      phone,
      email,
      address,
      region,
      latitude,
      longitude,
    });

    await contact.save();
    res.status(201).json({ message: 'Contact created', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContacts = async (req, res) => {
  try {
    const { type, region } = req.query;
    let query = {};

    if (type) query.type = type;
    if (region) query.region = region;

    const contacts = await EmergencyContact.find(query);
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getContactById = async (req, res) => {
  try {
    const contact = await EmergencyContact.findById(req.params.id);
    if (!contact) {
      return res.status(404).json({ message: 'Contact not found' });
    }
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateContact = async (req, res) => {
  try {
    const contact = await EmergencyContact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ message: 'Contact updated', contact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteContact = async (req, res) => {
  try {
    await EmergencyContact.findByIdAndDelete(req.params.id);
    res.json({ message: 'Contact deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
