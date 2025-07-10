import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Edit, Plus } from 'lucide-react';
import AlumniContactModal from '@/components/AlumniContactModal';

interface CompanyHistory {
  id: string;
  companyName: string;
  designation: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
}

interface AlumniContact {
  id: string;
  name: string;
  previousCompany: string;
  currentCompany: string;
  currentDesignation: string;
  lastContactDate: string;
  email?: string;
  phone?: string;
  notes?: string;
  companyHistory: CompanyHistory[];
}

const ClientAlumni = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<AlumniContact | null>(null);
  const [alumniContacts, setAlumniContacts] = useState<AlumniContact[]>([
    {
      id: '1',
      name: 'John Smith',
      previousCompany: 'TechCorp Inc.',
      currentCompany: 'Innovation Labs',
      currentDesignation: 'VP of Engineering',
      lastContactDate: '2024-01-15',
      email: 'john.smith@innovationlabs.com',
      phone: '(555) 123-4567',
      notes: 'Former client, moved to competitor',
      companyHistory: [
        {
          id: '1a',
          companyName: 'TechCorp Inc.',
          designation: 'Senior Software Engineer',
          startDate: '2020-01-01',
          endDate: '2023-12-31',
          isCurrent: false
        },
        {
          id: '1b',
          companyName: 'Innovation Labs',
          designation: 'VP of Engineering',
          startDate: '2024-01-01',
          endDate: undefined,
          isCurrent: true
        }
      ]
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      previousCompany: 'Global Solutions',
      currentCompany: 'StartupXYZ',
      currentDesignation: 'CTO',
      lastContactDate: '2024-02-20',
      email: 'sarah.j@startupxyz.com',
      phone: '(555) 987-6543',
      notes: 'Left for better opportunity',
      companyHistory: [
        {
          id: '2a',
          companyName: 'Global Solutions',
          designation: 'Technical Lead',
          startDate: '2019-03-01',
          endDate: '2024-01-31',
          isCurrent: false
        },
        {
          id: '2b',
          companyName: 'StartupXYZ',
          designation: 'CTO',
          startDate: '2024-02-01',
          endDate: undefined,
          isCurrent: true
        }
      ]
    },
    {
      id: '3',
      name: 'Michael Chen',
      previousCompany: 'Enterprise Systems',
      currentCompany: 'Tech Giants Inc.',
      currentDesignation: 'Senior Director',
      lastContactDate: '2024-03-10',
      email: 'mchen@techgiants.com',
      phone: '(555) 456-7890',
      notes: 'Promoted to senior position',
      companyHistory: [
        {
          id: '3a',
          companyName: 'Enterprise Systems',
          designation: 'Product Manager',
          startDate: '2018-06-01',
          endDate: '2023-11-30',
          isCurrent: false
        },
        {
          id: '3b',
          companyName: 'Tech Giants Inc.',
          designation: 'Senior Director',
          startDate: '2023-12-01',
          endDate: undefined,
          isCurrent: true
        }
      ]
    },
    {
      id: '4',
      name: 'Emily Davis',
      previousCompany: 'Digital Dynamics',
      currentCompany: 'Remote Solutions',
      currentDesignation: 'Founder & CEO',
      lastContactDate: '2024-01-30',
      email: 'emily.davis@remotesolutions.com',
      phone: '(555) 321-6540',
      notes: 'Started remote work company',
      companyHistory: [
        {
          id: '4a',
          companyName: 'Digital Dynamics',
          designation: 'Senior Developer',
          startDate: '2021-01-01',
          endDate: '2023-12-31',
          isCurrent: false
        },
        {
          id: '4b',
          companyName: 'Remote Solutions',
          designation: 'Founder & CEO',
          startDate: '2024-01-01',
          endDate: undefined,
          isCurrent: true
        }
      ]
    }
  ]);

  const filteredContacts = alumniContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.previousCompany.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.currentCompany.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleContactClick = (contact: AlumniContact) => {
    setSelectedContact(contact);
    setIsContactModalOpen(true);
  };

  const handleEdit = (contact: AlumniContact) => {
    // TODO: Implement edit functionality
    console.log('Edit contact:', contact);
  };

  const handleAddNew = () => {
    // TODO: Implement add new contact functionality
    console.log('Add new contact');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Client Alumni</h1>
          <p className="text-gray-600 mt-2">Track former clients and their current positions</p>
        </div>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Contact
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search by name, previous company, or current company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alumni Table */}
      <Card>
        <CardHeader>
          <CardTitle>Alumni Contacts ({filteredContacts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Previous Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Current Company</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Last Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact Info</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredContacts.map((contact) => (
                  <tr 
                    key={contact.id} 
                    className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleContactClick(contact)}
                  >
                    <td className="py-4 px-4">
                      <div>
                        <div className="font-medium text-gray-900">{contact.name}</div>
                        {contact.notes && (
                          <div className="text-sm text-gray-500 mt-1">{contact.notes}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" className="text-xs">
                        {contact.previousCompany}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="outline" className="text-xs">
                        {contact.currentCompany}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {formatDate(contact.lastContactDate)}
                    </td>
                    <td className="py-4 px-4">
                      <div className="text-sm">
                        {contact.email && (
                          <div className="text-blue-600">{contact.email}</div>
                        )}
                        {contact.phone && (
                          <div className="text-gray-600">{contact.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEdit(contact);
                        }}
                        className="flex items-center gap-1"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredContacts.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No alumni contacts found. {searchTerm && 'Try adjusting your search terms.'}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alumni Contact Modal */}
      <AlumniContactModal
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setSelectedContact(null);
        }}
        contact={selectedContact}
      />
    </div>
  );
};

export default ClientAlumni; 