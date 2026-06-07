'use client'

import { useState, useEffect } from 'react';
import { Mail, MapPin, Save, ExternalLink, Share2, Phone, Plus, X } from 'lucide-react';
import { contactSettingsAPI } from '../../services/api';
import toast, { Toaster } from 'react-hot-toast';

export function ManageContactSettings() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    enquiryEmail: '',
    address: '',
    phoneNumbers: [] as string[],
    instagram: '',
    twitter: '',
    linkedin: '',
    gmailUser: '',
    gmailPassword: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      const response = await contactSettingsAPI.getContactSettings();
      if (response.success && response.settings) {
        setFormData({
          email: response.settings.email || '',
          enquiryEmail: response.settings.enquiryEmail || '',
          address: response.settings.address || '',
          phoneNumbers: response.settings.phoneNumbers || [],
          instagram: response.settings.instagram || '',
          twitter: response.settings.twitter || '',
          linkedin: response.settings.linkedin || '',
          gmailUser: response.settings.gmailUser || '',
          gmailPassword: response.settings.gmailPassword || ''
        });
      }
    } catch (error) {
      console.error('Failed to load contact settings:', error);
      setError('Failed to load contact settings');
    } finally {
      setIsLoading(false);
    }
  };

  const addPhoneNumber = () => {
    setFormData({
      ...formData,
      phoneNumbers: [...formData.phoneNumbers, '']
    });
  };

  const removePhoneNumber = (index: number) => {
    setFormData({
      ...formData,
      phoneNumbers: formData.phoneNumbers.filter((_, i) => i !== index)
    });
  };

  const updatePhoneNumber = (index: number, value: string) => {
    const updatedPhones = [...formData.phoneNumbers];
    updatedPhones[index] = value;
    setFormData({
      ...formData,
      phoneNumbers: updatedPhones
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSaving(true);
    
    try {
      const response = await contactSettingsAPI.updateContactSettings(formData);
      if (response.success) {
        toast.success('Contact settings updated successfully!');
      }
    } catch (error: any) {
      console.error('Failed to save contact settings:', error);
      const errorMessage = error.response?.data?.error || 'Failed to save contact settings';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--card)',
            color: 'var(--foreground)',
            border: '1px solid var(--border)',
          },
          success: {
            iconTheme: {
              primary: 'var(--accent)',
              secondary: 'var(--card)',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: 'var(--card)',
            },
          },
        }}
      />
      
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-foreground">Contact Settings</h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage your contact information and social media links
          </p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      )}

      {/* Settings Form */}
      <div className="bg-card border border-border rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Contact Information Section */}
          <div>
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Mail size={20} className="text-accent" />
              Contact Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Display Email Address *
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="contact@example.com"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  This email will be displayed on your website
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Enquiry Email Address *
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    required
                    value={formData.enquiryEmail}
                    onChange={(e) => setFormData({ ...formData, enquiryEmail: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="enquiries@example.com"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Contact form submissions will be sent to this email
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Address *
                </label>
                <div className="relative">
                  <MapPin size={18} className="absolute left-3 top-3 text-muted-foreground" />
                  <textarea
                    required
                    rows={3}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="123 Main Street, City, Country"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-foreground">
                    Phone Numbers
                  </label>
                  <button
                    type="button"
                    onClick={addPhoneNumber}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-accent text-background rounded hover:bg-accent/90 transition-colors"
                  >
                    <Plus size={14} />
                    Add Phone
                  </button>
                </div>
                
                {formData.phoneNumbers.length === 0 ? (
                  <div className="text-sm text-muted-foreground italic">
                    No phone numbers added. Click "Add Phone" to add one.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {formData.phoneNumbers.map((phone, index) => (
                      <div key={index} className="flex gap-2">
                        <div className="relative flex-1">
                          <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => updatePhoneNumber(index, e.target.value)}
                            className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                            placeholder="+1 (555) 123-4567"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhoneNumber(index)}
                          className="flex items-center justify-center w-10 h-10 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                          title="Remove phone number"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-1">
                  Add multiple phone numbers for different purposes (office, mobile, etc.)
                </p>
              </div>
            </div>
          </div>

          {/* SMTP Configuration Section */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Mail size={20} className="text-accent" />
              SMTP Configuration (Optional)
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Configure SMTP credentials (e.g., Zoho) to send real emails. Leave empty to use test email service.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Provider Address
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="email"
                    value={formData.gmailUser}
                    onChange={(e) => setFormData({ ...formData, gmailUser: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    placeholder="e.g. your-email@zoho.in"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  The account that will send emails
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  App Password
                </label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="password"
                    value={formData.gmailPassword}
                    onChange={(e) => setFormData({ ...formData, gmailPassword: e.target.value })}
                    className="w-full pl-10 pr-3 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                    placeholder="Your App Password"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Generate this from your provider's security settings
                </p>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="pt-6 border-t border-border">
            <h3 className="text-lg font-medium text-foreground mb-4 flex items-center gap-2">
              <Share2 size={20} className="text-accent" />
              Social Media Links
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Add full URLs to your social media profiles (optional)
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Instagram
                </label>
                <div className="relative">
                  <Share2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://instagram.com/yourprofile"
                  />
                  {formData.instagram && (
                    <a
                      href={formData.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  X (Twitter)
                </label>
                <div className="relative">
                  <Share2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://x.com/yourprofile"
                  />
                  {formData.twitter && (
                    <a
                      href={formData.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  LinkedIn
                </label>
                <div className="relative">
                  <Share2 size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                    className="w-full pl-10 pr-10 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                  {formData.linkedin && (
                    <a
                      href={formData.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Save Button */}
          <div className="pt-6 border-t border-border">
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-6 py-2 bg-accent text-background rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save size={16} />
              {isSaving ? 'Saving...' : 'Save Settings'}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <h3 className="text-lg font-medium text-foreground mb-4">Preview</h3>
        <div className="space-y-3">
          {formData.email && (
            <div className="flex items-center gap-3 text-sm">
              <Mail size={16} className="text-accent" />
              <span className="text-foreground">{formData.email}</span>
            </div>
          )}
          {formData.address && (
            <div className="flex items-start gap-3 text-sm">
              <MapPin size={16} className="text-accent mt-0.5" />
              <span className="text-foreground">{formData.address}</span>
            </div>
          )}
          {formData.phoneNumbers.length > 0 && (
            <div className="space-y-2">
              {formData.phoneNumbers.map((phone, index) => (
                phone && (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    <Phone size={16} className="text-accent" />
                    <span className="text-foreground">{phone}</span>
                  </div>
                )
              ))}
            </div>
          )}
          
          {/* Gmail Status */}
          <div className="flex items-center gap-3 text-sm pt-2 border-t border-border">
            <Mail size={16} className={formData.gmailUser && formData.gmailPassword ? "text-green-500" : "text-yellow-500"} />
            <span className={formData.gmailUser && formData.gmailPassword ? "text-green-500" : "text-yellow-500"}>
              {formData.gmailUser && formData.gmailPassword 
                ? `Gmail configured: ${formData.gmailUser}` 
                : "Using test email service (no real emails sent)"}
            </span>
          </div>
          
          {(formData.instagram || formData.twitter || formData.linkedin) && (
            <div className="flex items-center gap-4 pt-2">
              {formData.instagram && (
                <a
                  href={formData.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                  title="Instagram"
                >
                  <Share2 size={16} />
                  <span>Instagram</span>
                </a>
              )}
              {formData.twitter && (
                <a
                  href={formData.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                  title="X (Twitter)"
                >
                  <Share2 size={16} />
                  <span>X</span>
                </a>
              )}
              {formData.linkedin && (
                <a
                  href={formData.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-muted-foreground hover:text-accent transition-colors"
                  title="LinkedIn"
                >
                  <Share2 size={16} />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
