'use client';

import { useState, useMemo } from 'react';
import type { IWidget } from '@/models/widget';
import { WidgetCard } from './widget-card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

const ITEMS_PER_PAGE = 6;

export default function DashboardClient({ widgets }: { widgets: IWidget[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredWidgets = useMemo(() => {
    return widgets.filter((widget) =>
      widget.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      widget.website.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [widgets, searchTerm]);

  const totalPages = Math.ceil(filteredWidgets.length / ITEMS_PER_PAGE);

  const paginatedWidgets = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWidgets.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredWidgets, currentPage]);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-8">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search widgets by name or URL..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-full pl-10"
        />
      </div>

      {paginatedWidgets.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {paginatedWidgets.map((widget) => (
            <WidgetCard key={widget._id.toString()} widget={widget} />
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-12">
          No widgets found for your search term.
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
