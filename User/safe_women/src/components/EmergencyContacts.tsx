import React, { useState, useEffect } from 'react';
import { Plus, Phone, Edit, Trash2, User, MessageSquare } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  phone: string;
  relationship: string;
  isPrimary: boolean;
}

const EmergencyContacts: React.FC = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
    isPrimary: false
  });

  useEffect(() => {
    // Load contacts from localStorage
    const savedContacts = localStorage.getItem('emergency-contacts');
    if (savedContacts) {
      try {
        setContacts(JSON.parse(savedContacts));
      } catch (error) {
        console.error('Error loading contacts:', error);
      }
    }
  }, []);

  const saveContactsToStorage = (newContacts: Contact[]) => {
    localStorage.setItem('emergency-contacts', JSON.stringify(newContacts));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.phone.trim()) {
      alert('Please fill in all required fields');
      return;
    }

    let updatedContacts: Contact[];

    if (editingContact) {
      // Update existing contact
      updatedContacts = contacts.map(contact => 
        contact.id === editingContact.id 
          ? { ...contact, ...formData }
          : contact
      );
    } else {
      // Add new contact
      const newContact: Contact = {
        id: Date.now().toString(),
        ...formData
      };
      updatedContacts = [...contacts, newContact];
    }

    // Ensure only one primary contact
    if (formData.isPrimary) {
      updatedContacts = updatedContacts.map(contact => ({
        ...contact,
        isPrimary: contact.id === (editingContact?.id || updatedContacts[updatedContacts.length - 1].id)
      }));
    }

    setContacts(updatedContacts);
    saveContactsToStorage(updatedContacts);
    resetForm();
  };

  const resetForm = () => {
    setFormData({ name: '', phone: '', relationship: '', isPrimary: false });
    setShowAddForm(false);
    setEditingContact(null);
  };

  const deleteContact = (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      const updatedContacts = contacts.filter(contact => contact.id !== id);
      setContacts(updatedContacts);
      saveContactsToStorage(updatedContacts);
    }
  };

  const editContact = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      name: contact.name,
      phone: contact.phone,
      relationship: contact.relationship,
      isPrimary: contact.isPrimary
    });
    setShowAddForm(true);
  };

  const setPrimaryContact = (id: string) => {
    const updatedContacts = contacts.map(contact => ({
      ...contact,
      isPrimary: contact.id === id
    }));
    setContacts(updatedContacts);
    saveContactsToStorage(updatedContacts);
  };

  const callContact = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const sendMessage = (phone: string, name: string) => {
    const message = `🚨 This is an emergency message from SheSecure app. I may need assistance.`;
    const smsUrl = `sms:${phone}?body=${encodeURIComponent(message)}`;
    window.open(smsUrl, '_blank');
  };

  const relationships = [
    'Family Member',
    'Friend',
    'Partner/Spouse',
    'Colleague',
    'Neighbor',
    'Healthcare Provider',
    'Other'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Emergency Contacts
        </h2>
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Contact</span>
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {editingContact ? 'Edit Contact' : 'Add Emergency Contact'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter contact name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Phone Number *
              </label>
              <input
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Relationship
              </label>
              <select
                value={formData.relationship}
                onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white"
              >
                <option value="">Select relationship</option>
                {relationships.map(rel => (
                  <option key={rel} value={rel}>{rel}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isPrimary"
                checked={formData.isPrimary}
                onChange={(e) => setFormData({ ...formData, isPrimary: e.target.checked })}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <label htmlFor="isPrimary" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                Set as primary emergency contact
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                {editingContact ? 'Update Contact' : 'Add Contact'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Contacts List */}
      <div className="space-y-4">
        {contacts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 text-center">
            <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">No emergency contacts added</p>
            <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
              Add trusted contacts who can help you in emergency situations
            </p>
          </div>
        ) : (
          contacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border transition-all ${
                contact.isPrimary 
                  ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10' 
                  : 'border-gray-100 dark:border-gray-700'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {contact.name}
                    </h3>
                    {contact.isPrimary && (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs font-medium rounded-full">
                        Primary
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mb-1">{contact.phone}</p>
                  {contact.relationship && (
                    <p className="text-sm text-gray-500 dark:text-gray-500">{contact.relationship}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => editContact(contact)}
                    className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteContact(contact.id)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => callContact(contact.phone)}
                  className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </button>
                <button
                  onClick={() => sendMessage(contact.phone, contact.name)}
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 px-4 rounded-xl font-medium flex items-center justify-center space-x-2 transition-colors"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Message</span>
                </button>
                {!contact.isPrimary && (
                  <button
                    onClick={() => setPrimaryContact(contact.id)}
                    className="px-4 py-3 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-xl font-medium transition-colors text-sm"
                  >
                    Set Primary
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Info Section */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-4 rounded-xl">
        <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Emergency Contact Tips</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
          <li>• Add at least 2-3 trusted contacts</li>
          <li>• Include different types of relationships (family, friends, etc.)</li>
          <li>• Inform your contacts that they're listed as emergency contacts</li>
          <li>• Keep contact information updated</li>
        </ul>
      </div>
    </div>
  );
};

export default EmergencyContacts;