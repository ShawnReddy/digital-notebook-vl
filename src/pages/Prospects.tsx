import React, { useState } from 'react';
import { Search, Filter, TrendingUp, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface Prospect {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  location: string;
  potentialRevenue: string;
  stage: 'cold' | 'warm' | 'hot';
  lastContact: string;
  selected: boolean;
}

const Prospects = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const { toast } = useToast();
  const [prospects, setProspects] = useState<Prospect[]>([
    {
      id: '1',
      name: 'Lisa Thompson',
      company: 'Future Tech Inc.',
      email: 'l.thompson@futuretech.com',
      phone: '+1 (555) 234-5678',
      location: 'Seattle, WA',
      potentialRevenue: '$150K',
      stage: 'hot',
      lastContact: '2024-12-29',
      selected: false
    },
    {
      id: '2',
      name: 'Robert Kim',
      company: 'NextGen Solutions',
      email: 'r.kim@nextgen.com',
      phone: '+1 (555) 345-6789',
      location: 'Denver, CO',
      potentialRevenue: '$200K',
      stage: 'warm',
      lastContact: '2024-12-26',
      selected: false
    },
    {
      id: '3',
      name: 'Amanda Foster',
      company: 'Digital Dynamics',
      email: 'a.foster@digitaldyn.com',
      phone: '+1 (555) 456-7891',
      location: 'Miami, FL',
      potentialRevenue: '$300K',
      stage: 'cold',
      lastContact: '2024-12-15',
      selected: false
    },
    {
      id: '4',
      name: 'James Wilson',
      company: 'Startup Ventures',
      email: 'j.wilson@startupv.com',
      phone: '+1 (555) 567-8901',
      location: 'Boston, MA',
      potentialRevenue: '$180K',
      stage: 'hot',
      lastContact: '2024-12-28',
      selected: false
    }
  ]);

  const handleProspectSelect = (prospectId: string) => {
    setProspects(prospects.map(prospect => 
      prospect.id === prospectId ? { ...prospect, selected: !prospect.selected } : prospect
    ));
  };

  const handleAddToDashboard = () => {
    const selectedProspects = prospects.filter(p => p.selected);
    if (selectedProspects.length > 0) {
      toast({
        title: "Added to Dashboard",
        description: `${selectedProspects.length} prospect${selectedProspects.length > 1 ? 's' : ''} added to your dashboard.`,
      });
      // Clear selections after adding
      setProspects(prospects.map(prospect => ({ ...prospect, selected: false })));
    }
  };

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredProspects = prospects.filter(prospect => {
    const matchesSearch = prospect.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prospect.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = stageFilter === 'all' || prospect.stage === stageFilter;
    return matchesSearch && matchesStage;
  });

  const selectedCount = prospects.filter(p => p.selected).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Prospects</h1>
        <p className="text-gray-600">Track and nurture potential clients through the sales pipeline.</p>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search prospects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button 
            variant="outline" 
            className="flex items-center"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          {selectedCount > 0 && (
            <Button 
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleAddToDashboard}
            >
              Add {selectedCount} to Dashboard
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-gray-700">Stage:</label>
              <Select value={stageFilter} onValueChange={setStageFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="hot">Hot</SelectItem>
                  <SelectItem value="warm">Warm</SelectItem>
                  <SelectItem value="cold">Cold</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>

      {/* Prospects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProspects.map((prospect) => (
          <Card key={prospect.id} className="hover:shadow-lg transition-shadow duration-200">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    checked={prospect.selected}
                    onCheckedChange={() => handleProspectSelect(prospect.id)}
                  />
                  <div>
                    <CardTitle className="text-lg">{prospect.name}</CardTitle>
                    <p className="text-sm text-gray-600">{prospect.company}</p>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${getStageColor(prospect.stage)}`}>
                  {prospect.stage}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2" />
                {prospect.email}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2" />
                {prospect.phone}
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2" />
                {prospect.location}
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500">Potential Revenue</p>
                  <p className="font-semibold text-blue-600 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {prospect.potentialRevenue}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Last Contact</p>
                  <p className="text-sm font-medium">{new Date(prospect.lastContact).toLocaleDateString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProspects.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No prospects found matching your search.</p>
        </div>
      )}
    </div>
  );
};

export default Prospects;
