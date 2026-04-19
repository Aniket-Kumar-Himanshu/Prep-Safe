import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import { contactAPI } from '../services/api';
import { Card, Badge } from '../components/UI';
import { motion } from 'framer-motion';

export const EmergencyContactsPage = () => {
  const { user } = useContext(AuthContext);
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const contactTypes = ['hospital', 'fire_department', 'police', 'helpline', 'other'];
  const iconMap = {
    hospital: '🏥',
    fire_department: '🚒',
    police: '🚔',
    helpline: '📞',
    other: '📍',
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const res = await contactAPI.getAll(null, user?.region);
      setContacts(res.data);
      setFilteredContacts(res.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let filtered = contacts;

    if (selectedType !== 'all') {
      filtered = filtered.filter((c) => c.type === selectedType);
    }

    if (searchTerm) {
      filtered = filtered.filter((c) =>
        c.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredContacts(filtered);
  }, [selectedType, searchTerm, contacts]);

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 min-h-screen flex items-center justify-center relative overflow-hidden">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-5xl"
        >
          📞
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-slate-950 via-blue-900 to-slate-900 min-h-screen py-12 relative overflow-hidden">
      {/* Animated background blobs */}
      <motion.div
        className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-40 right-10 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 18, repeat: Infinity, delay: 2 }}
      />

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-5xl font-black bg-gradient-to-r from-red-300 to-orange-300 bg-clip-text text-transparent mb-3">
            🚨 Emergency Contacts
          </h1>
          <p className="text-lg text-gray-300">Quick access to local emergency services in <span className="text-red-400 font-bold">{user?.region}</span></p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-8 rounded-2xl mb-12 hover:border-white/30 transition-all duration-300"
        >
          <div className="space-y-6">
            <div>
              <label className="block text-blue-300 font-bold mb-3 text-lg">🔍 Search Service</label>
              <input
                type="text"
                placeholder="Search by name or service..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder-gray-400"
              />
            </div>

            <div>
              <label className="block text-blue-300 font-bold mb-4 text-lg">📋 Filter by Type</label>
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedType('all')}
                  className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                    selectedType === 'all'
                      ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                      : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                  }`}
                >
                  All Services
                </motion.button>
                {contactTypes.map((type) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => setSelectedType(type)}
                    className={`px-6 py-3 rounded-xl font-bold transition-all duration-300 ${
                      selectedType === type
                        ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/50'
                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:border-white/30'
                    }`}
                  >
                    {iconMap[type]} {type.replace('_', ' ').toUpperCase()}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Contacts List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredContacts.map((contact, idx) => (
            <motion.div
              key={contact._id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 hover:border-white/30 p-8 rounded-2xl transition-all duration-300 group"
            >
              <div className="flex items-start gap-6">
                <div className="text-5xl group-hover:scale-110 transition-transform duration-300">{iconMap[contact.type]}</div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-bold text-white mb-3">{contact.name}</h3>
                  <span className="inline-block px-4 py-2 rounded-full bg-blue-500/30 text-blue-300 border border-blue-400/50 font-bold text-sm mb-4">
                    {contact.type.replace('_', ' ').charAt(0).toUpperCase() + contact.type.replace('_', ' ').slice(1)}
                  </span>

                  <div className="mt-6 space-y-4">
                    <motion.div
                      whileHover={{ x: 5 }}
                      className="border-l-2 border-red-400 pl-4"
                    >
                      <p className="text-xs text-gray-400 mb-1 font-semibold">📱 PHONE</p>
                      <a
                        href={`tel:${contact.phone}`}
                        className="text-red-300 font-bold text-lg hover:text-red-200 transition-colors"
                      >
                        {contact.phone}
                      </a>
                    </motion.div>

                    {contact.email && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="border-l-2 border-blue-400 pl-4"
                      >
                        <p className="text-xs text-gray-400 mb-1 font-semibold">📧 EMAIL</p>
                        <a
                          href={`mailto:${contact.email}`}
                          className="text-blue-300 font-bold hover:text-blue-200 transition-colors break-all"
                        >
                          {contact.email}
                        </a>
                      </motion.div>
                    )}

                    {contact.address && (
                      <motion.div
                        whileHover={{ x: 5 }}
                        className="border-l-2 border-green-400 pl-4"
                      >
                        <p className="text-xs text-gray-400 mb-1 font-semibold">📍 ADDRESS</p>
                        <p className="text-gray-300 font-medium">{contact.address}</p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md border border-white/10 p-12 rounded-2xl text-center"
          >
            <div className="text-5xl mb-4">🔍</div>
            <p className="text-gray-300 text-xl font-semibold">No contacts found matching your search.</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
