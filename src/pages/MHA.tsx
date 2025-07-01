
import React, { useState } from 'react';
import { Search, Filter, Building, Phone, Mail, MapPin, Target, TrendingUp, Users, MessageSquare, PhoneCall, Calendar, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import BriefModal from '@/components/BriefModal';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface Contact {
  id: string;
  name: string;
  title: string;
  email: string;
  phone: string;
  lastContact: string;
}

interface InteractionHistory {
  id: string;
  type: 'email' | 'call' | 'meeting' | 'note';
  date: string;
  time: string;
  subject: string;
  content: string;
  contact: string;
}

interface MHAAccount {
  id: string;
  name: string;
  organization: string;
  email: string;
  phone: string;
  location: string;
  potentialValue: string;
  lastContact: string;
  status: 'hot-lead' | 'warm-lead' | 'cold-lead';
  selected: boolean;
  contacts: Contact[];
}

interface Meeting {
  id: string;
  title: string;
  client: string;
  time: string;
  type: 'call' | 'meeting' | 'demo';
}

const MHA = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isBriefModalOpen, setIsBriefModalOpen] = useState(false);
  const [selectedAccountForBrief, setSelectedAccountForBrief] = useState<Meeting | null>(null);
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<MHAAccount | null>(null);
  const [isInteractionModalOpen, setIsInteractionModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const { toast } = useToast();
  
  const [mhaAccounts, setMhaAccounts] = useState<MHAAccount[]>([
    {
      id: '1',
      name: 'Dr. Sandra Martinez',
      organization: 'Metro Health Alliance',
      email: 's.martinez@metrohealth.org',
      phone: '+1 (555) 234-5678',
      location: 'Los Angeles, CA',
      potentialValue: '$450K',
      lastContact: '2024-12-15',
      status: 'hot-lead',
      selected: false,
      contacts: [
        {
          id: '1a',
          name: 'Dr. Sandra Martinez',
          title: 'Chief Medical Officer',
          email: 's.martinez@metrohealth.org',
          phone: '+1 (555) 234-5678',
          lastContact: '2024-12-15'
        },
        {
          id: '1b',
          name: 'Robert Chen',
          title: 'Director of Operations',
          email: 'r.chen@metrohealth.org',
          phone: '+1 (555) 234-5679',
          lastContact: '2024-12-12'
        }
      ]
    },
    {
      id: '2',
      name: 'Dr. Michael Thompson',
      organization: 'Regional Medical Group',
      email: 'm.thompson@regionalmed.com',
      phone: '+1 (555) 345-6789',
      location: 'Dallas, TX',
      potentialValue: '$320K',
      lastContact: '2024-12-10',
      status: 'warm-lead',
      selected: false,
      contacts: [
        {
          id: '2a',
          name: 'Dr. Michael Thompson',
          title: 'Regional Director',
          email: 'm.thompson@regionalmed.com',
          phone: '+1 (555) 345-6789',
          lastContact: '2024-12-10'
        }
      ]
    },
    {
      id: '3',
      name: 'Dr. Lisa Wang',
      organization: 'Community Healthcare Network',
      email: 'l.wang@communityhealth.org',
      phone: '+1 (555) 456-7890',
      location: 'Atlanta, GA',
      potentialValue: '$280K',
      lastContact: '2024-11-28',
      status: 'cold-lead',
      selected: false,
      contacts: [
        {
          id: '3a',
          name: 'Dr. Lisa Wang',
          title: 'Network Administrator',
          email: 'l.wang@communityhealth.org',
          phone: '+1 (555) 456-7890',
          lastContact: '2024-11-28'
        },
        {
          id: '3b',
          name: 'Jennifer Adams',
          title: 'Compliance Officer',
          email: 'j.adams@communityhealth.org',
          phone: '+1 (555) 456-7891',
          lastContact: '2024-11-25'
        }
      ]
    },
    {
      id: '4',
      name: 'Dr. Robert Johnson',
      organization: 'Integrated Care Systems',
      email: 'r.johnson@integratedcare.com',
      phone: '+1 (555) 567-8901',
      location: 'Phoenix, AZ',
      potentialValue: '$520K',
      lastContact: '2024-12-20',
      status: 'hot-lead',
      selected: false,
      contacts: [
        {
          id: '4a',
          name: 'Dr. Robert Johnson',
          title: 'Chief Executive Officer',
          email: 'r.johnson@integratedcare.com',
          phone: '+1 (555) 567-8901',
          lastContact: '2024-12-20'
        }
      ]
    }
  ]);

  // Mock interaction history data - Note: In production, this would come from Compass
  const getInteractionHistory = (contactId: string): InteractionHistory[] => {
    const mockHistory: InteractionHistory[] = [
      {
        id: '1',
        type: 'email',
        date: '2024-12-15',
        time: '1:20 PM',
        subject: 'MHA Partnership Proposal',
        content: 'Sent comprehensive partnership proposal focusing on healthcare compliance and operational efficiency.',
        contact: 'Dr. Sandra Martinez'
      },
      {
        id: '2',
        type: 'call',
        date: '2024-12-12',
        time: '10:30 AM',
        subject: 'Compliance Requirements Discussion',
        content: 'Discussed current compliance challenges and our solutions. Very positive reception from leadership team.',
        contact: 'Dr. Sandra Martinez'
      },
      {
        id: '3',
        type: 'meeting',
        date: '2024-12-08',
        time: '2:00 PM',
        subject: 'Strategic Planning Session',
        content: 'Participated in their strategic planning meeting. Identified key areas where our services align with their goals.',
        contact: 'Dr. Sandra Martinez'
      },
      {
        id: '4',
        type: 'note',
        date: '2024-12-05',
        time: '3:45 PM',
        subject: 'Account Priority Status',
        content: 'Elevated to highest priority MHA account. Strong conversion potential. Decision timeline Q1 2025.',
        contact: 'Internal'
      }
    ];
    return mockHistory;
  };

  const handleAccountSelect = (accountId: string) => {
    setMhaAccounts(mhaAccounts.map(account => 
      account.id === accountId ? { ...account, selected: !account.selected } : account
    ));
  };

  const handleAccountClick = (account: MHAAccount) => {
    setSelectedCompany(account);
    setIsCompanyModalOpen(true);
  };

  const handleContactClick = (contact: Contact) => {
    setSelectedContact(contact);
    setIsInteractionModalOpen(true);
  };

  const handleDeepResearch = () => {
    if (selectedCompany) {
      const meetingData: Meeting = {
        id: selectedCompany.id,
        title: `MHA Brief - ${selectedCompany.organization}`,
        client: selectedCompany.organization,
        time: 'Current',
        type: 'meeting'
      };
      setSelectedAccountForBrief(meetingData);
      setIsBriefModalOpen(true);
      setIsCompanyModalOpen(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot-lead': return 'bg-red-100 text-red-800';
      case 'warm-lead': return 'bg-yellow-100 text-yellow-800';
      case 'cold-lead': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'hot-lead': return 'Hot Lead';
      case 'warm-lead': return 'Warm Lead';
      case 'cold-lead': return 'Cold Lead';
      default: return status;
    }
  };

  const getInteractionIcon = (type: string) => {
    switch (type) {
      case 'email': return <Mail className="w-4 h-4" />;
      case 'call': return <PhoneCall className="w-4 h-4" />;
      case 'meeting': return <Calendar className="w-4 h-4" />;
      case 'note': return <FileText className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'email': return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'call': return 'bg-green-50 text-green-700 border-green-200';
      case 'meeting': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'note': return 'bg-yellow-50 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredAccounts = mhaAccounts.filter(account =>
    account.organization.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedCount = mhaAccounts.filter(a => a.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Must Have Accounts (MHA)</h1>
        <p className="text-gray-600">Priority accounts targeted for client conversion - track leads and conversion opportunities.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search priority accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
        {selectedCount > 0 && (
          <Button 
            className="bg-blue-600 hover:bg-blue-700"
            onClick={() => {
              toast({
                title: "Added to Pipeline",
                description: `${selectedCount} account${selectedCount > 1 ? 's' : ''} added to pipeline.`,
              });
              setMhaAccounts(mhaAccounts.map(account => ({ ...account, selected: false })));
            }}
          >
            Add {selectedCount} to Pipeline
          </Button>
        )}
      </div>

      {/* MHA Accounts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAccounts.map((account) => (
          <Card 
            key={account.id} 
            className="hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleAccountClick(account)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={account.selected}
                    onCheckedChange={() => handleAccountSelect(account.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div>
                    <CardTitle className="text-lg font-bold">{account.organization}</CardTitle>
                    <p className="text-sm text-gray-600 flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {account.contacts.length} contact{account.contacts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(account.status)}`}>
                  {getStatusText(account.status)}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {account.location}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Potential Value</p>
                  <p className="font-semibold text-green-600 flex items-center">
                    <Target className="w-4 h-4 mr-1" />
                    {account.potentialValue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Contact</p>
                  <p className="text-sm font-medium">{new Date(account.lastContact).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredAccounts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No priority accounts found matching your search.</p>
        </div>
      )}

      {/* Company Details Modal */}
      <Dialog open={isCompanyModalOpen} onOpenChange={setIsCompanyModalOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">{selectedCompany?.organization}</DialogTitle>
          </DialogHeader>
          
          {selectedCompany && (
            <div className="space-y-6">
              <Button onClick={handleDeepResearch} className="w-full bg-blue-600 hover:bg-blue-700">
                Deep Research
              </Button>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Organization Contacts</h3>
                <p className="text-sm text-gray-500 mb-4">
                  * Contact information displayed here would be populated from Compass based on user selection
                </p>
                <div className="space-y-3">
                  {selectedCompany.contacts.map((contact) => (
                    <Card 
                      key={contact.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleContactClick(contact)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold">{contact.name}</h4>
                            <p className="text-sm text-gray-600">{contact.title}</p>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Mail className="w-3 h-3 mr-1" />
                              {contact.email}
                            </div>
                            <div className="flex items-center text-sm text-gray-500 mt-1">
                              <Phone className="w-3 h-3 mr-1" />
                              {contact.phone}
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-gray-500">Last Contact</p>
                            <p className="text-sm font-medium">{new Date(contact.lastContact).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Interaction History Modal */}
      <Dialog open={isInteractionModalOpen} onOpenChange={setIsInteractionModalOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Interaction History - {selectedContact?.name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedContact && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold">{selectedContact.name}</h4>
                <p className="text-sm text-gray-600">{selectedContact.title}</p>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <Mail className="w-3 h-3 mr-1" />
                  {selectedContact.email}
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Recent Interactions</h3>
                {getInteractionHistory(selectedContact.id).map((interaction) => (
                  <Card key={interaction.id} className="border-l-4 border-l-blue-500">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <Badge className={`px-2 py-1 text-xs ${getInteractionColor(interaction.type)}`}>
                            <div className="flex items-center space-x-1">
                              {getInteractionIcon(interaction.type)}
                              <span className="capitalize">{interaction.type}</span>
                            </div>
                          </Badge>
                          <span className="text-sm font-medium">{interaction.subject}</span>
                        </div>
                        <div className="text-right text-sm text-gray-500">
                          <p>{new Date(interaction.date).toLocaleDateString()}</p>
                          <p>{interaction.time}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-700">{interaction.content}</p>
                      <p className="text-xs text-gray-500 mt-2">Contact: {interaction.contact}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <BriefModal
        isOpen={isBriefModalOpen}
        onClose={() => {
          setIsBriefModalOpen(false);
          setSelectedAccountForBrief(null);
        }}
        meeting={selectedAccountForBrief}
      />
    </div>
  );
};

export default MHA;
