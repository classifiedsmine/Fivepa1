import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { X, Layers, Plus, Trash2 } from 'lucide-react';

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOfferCreated: (offer: any) => void;
}

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({
  isOpen,
  onClose,
  onOfferCreated,
}) => {
  const { currentUser, fetchWithAuth } = useAuth();
  const { success, error } = useToast();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Development & IT');
  const [subcategory, setSubcategory] = useState('Full Stack Development');
  const [skillsInput, setSkillsInput] = useState('React, TypeScript, Cloud Run');

  // Single base package
  const [basePrice, setBasePrice] = useState(250);
  const [deliveryDays, setDeliveryDays] = useState(3);
  const [revisions, setRevisions] = useState(2);
  const [featuresInput, setFeaturesInput] = useState('Full source code, Core setup, Documentation, 14-day warranty');

  // Extra services (Addons)
  const [addons, setAddons] = useState<
    { id: string; title: string; price: number; extraDays: number; description: string }[]
  >([
    {
      id: 'add-1',
      title: 'Fast 1-Day Express Delivery',
      description: 'Prioritize order to deliver within 24 hours',
      price: 75,
      extraDays: -2,
    },
    {
      id: 'add-2',
      title: 'Commercial License & Assets',
      description: 'Full commercial resale and copyright transfer rights',
      price: 50,
      extraDays: 0,
    },
  ]);

  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleAddExtraService = () => {
    setAddons([
      ...addons,
      {
        id: `add-${Date.now()}`,
        title: '',
        description: '',
        price: 25,
        extraDays: 0,
      },
    ]);
  };

  const handleUpdateAddon = (index: number, field: string, value: any) => {
    const next = [...addons];
    next[index] = { ...next[index], [field]: value };
    setAddons(next);
  };

  const handleRemoveAddon = (index: number) => {
    setAddons(addons.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      error('Missing fields', 'Please provide a title and detailed service description.');
      return;
    }

    setIsSubmitting(true);
    try {
      const skillsArray = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      const featuresArray = featuresInput
        .split(',')
        .map((f) => f.trim())
        .filter(Boolean);

      const packages = {
        basic: {
          name: 'Standard Service',
          title: title,
          description: description,
          price: Number(basePrice),
          deliveryDays: Number(deliveryDays),
          revisions: Number(revisions),
          features: featuresArray,
        },
      };

      const res = await fetchWithAuth('/api/marketplace/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          freelancerId: currentUser.id,
          title,
          description,
          category,
          subcategory,
          skills: skillsArray,
          price: Number(basePrice),
          deliveryDays: Number(deliveryDays),
          revisions: Number(revisions),
          features: featuresArray,
          addons: addons.filter((a) => a.title.trim().length > 0),
          packages,
          images: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=80'],
          faqs: [
            {
              question: 'How does milestone escrow protect my payment?',
              answer: 'Clients fund the service price into Escrow upon ordering. Funds are safely held until deliverable acceptance and 14-day clearance.',
            },
          ],
        }),
      });

      const data = await res.json();
      if (data.offer) {
        success('Service Published!', `Your offer "${title}" is now published.`);
        onOfferCreated(data.offer);
        onClose();
      } else {
        error('Failed to create offer', data.error || 'Server error');
      }
    } catch (err: any) {
      error('Error', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden my-8">
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Publish Service Offer</h2>
              <p className="text-xs text-slate-300">
                Define your core service offer and add optional extra services
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Service Title (I will...)
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. I will build and deploy a production container on Google Cloud Run"
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
              >
                <option value="Development & IT">Development & IT</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Design & Creative">Design & Creative</option>
                <option value="Writing & Translation">Writing & Translation</option>
                <option value="Sales & Marketing">Sales & Marketing</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
                Subcategory
              </label>
              <input
                type="text"
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Service Overview & Specifications
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what is included, your methodology, technologies utilized, and what the buyer will receive..."
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wide mb-1.5">
              Relevant Skills (comma separated)
            </label>
            <input
              type="text"
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:border-emerald-500 focus:outline-hidden"
            />
          </div>

          {/* Core Service Terms */}
          <div className="p-5 border border-slate-200 rounded-xl bg-slate-50/70 space-y-4">
            <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
              Core Service Package
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Price ($ USD)</label>
                <input
                  type="number"
                  required
                  value={basePrice}
                  onChange={(e) => setBasePrice(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-bold text-emerald-700"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Delivery Time (Days)</label>
                <input
                  type="number"
                  required
                  value={deliveryDays}
                  onChange={(e) => setDeliveryDays(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Revisions (-1 = Unlimited)</label>
                <input
                  type="number"
                  required
                  value={revisions}
                  onChange={(e) => setRevisions(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Included Features (comma separated)
              </label>
              <input
                type="text"
                value={featuresInput}
                onChange={(e) => setFeaturesInput(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-300 rounded-lg text-xs"
                placeholder="Feature 1, Feature 2, Feature 3"
              />
            </div>
          </div>

          {/* Extra Services Section */}
          <div className="p-5 border border-slate-200 rounded-xl bg-white space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-900 text-sm uppercase tracking-wider">
                  Extra Services & Add-ons
                </h3>
                <p className="text-xs text-slate-500">
                  Allow buyers to customize their order with optional extra services below
                </p>
              </div>
              <button
                type="button"
                onClick={handleAddExtraService}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg border border-emerald-200 transition"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Extra
              </button>
            </div>

            {addons.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">No extra services added yet.</p>
            ) : (
              <div className="space-y-3">
                {addons.map((addon, index) => (
                  <div
                    key={addon.id || index}
                    className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 space-y-2 text-xs"
                  >
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Extra title (e.g., Fast 24h Express Delivery)"
                        value={addon.title}
                        onChange={(e) => handleUpdateAddon(index, 'title', e.target.value)}
                        className="flex-1 px-2.5 py-1.5 bg-white border border-slate-300 rounded font-semibold text-slate-900"
                      />
                      <div className="w-24 flex items-center gap-1">
                        <span className="text-slate-500 font-bold">$</span>
                        <input
                          type="number"
                          placeholder="Price"
                          value={addon.price}
                          onChange={(e) => handleUpdateAddon(index, 'price', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded font-bold text-emerald-700"
                        />
                      </div>
                      <div className="w-24 flex items-center gap-1">
                        <input
                          type="number"
                          placeholder="+Days"
                          value={addon.extraDays}
                          onChange={(e) => handleUpdateAddon(index, 'extraDays', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded"
                        />
                        <span className="text-slate-400">d</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAddon(index)}
                        className="p-1 text-slate-400 hover:text-red-600 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <input
                      type="text"
                      placeholder="Optional brief description of this extra..."
                      value={addon.description}
                      onChange={(e) => handleUpdateAddon(index, 'description', e.target.value)}
                      className="w-full px-2.5 py-1 bg-white border border-slate-200 rounded text-slate-600"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-600 hover:text-slate-900 font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Publishing...' : 'Publish Service Offer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
