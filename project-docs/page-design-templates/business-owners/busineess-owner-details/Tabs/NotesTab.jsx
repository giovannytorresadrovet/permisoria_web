'use client';

import { useState, useEffect } from 'react';
import { Card, Button, Avatar, Dropdown, Badge } from 'keep-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardText, 
  PushPin, 
  DotsThreeVertical, 
  Plus, 
  Clock, 
  CalendarBlank, 
  Trash, 
  PencilSimple
} from 'phosphor-react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

// Components
import ErrorMessage from '@/components/auth/ErrorMessage';
import EmptyState from '@/components/common/EmptyState';
import LoadingSkeleton from '@/components/common/LoadingSkeleton';
import { Input } from '@/components/common/Input';

// Validation schema for note form
const noteSchema = z.object({
  content: z.string().min(1, 'Note content is required'),
  category: z.string().optional(),
});

// Note categories with colors
const noteCategories = [
  { id: 'general', name: 'General', color: 'gray' },
  { id: 'verification', name: 'Verification', color: 'blue' },
  { id: 'compliance', name: 'Compliance', color: 'purple' },
  { id: 'business', name: 'Business', color: 'green' },
  { id: 'important', name: 'Important', color: 'red' },
];

// Component for an individual note card
const NoteCard = ({ note, onPin, onEdit, onDelete, currentUserId }) => {
  const noteDate = new Date(note.createdAt);
  
  // Get category details
  const category = noteCategories.find(c => c.id === note.category) || noteCategories[0];
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className={`card-glass h-full ${note.isPinned ? 'border-l-4 border-l-yellow-500' : ''}`}>
        <div className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex items-start gap-3">
              <Avatar
                shape="circle"
                size="md"
                className="bg-gray-700 text-white"
              >
                {note.authorName?.charAt(0) || 'U'}
              </Avatar>
              
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-white">{note.authorName || 'Permit Manager'}</h3>
                  {note.isPinned && (
                    <PushPin size={14} weight="fill" className="text-yellow-500" />
                  )}
                </div>
                <div className="flex items-center text-sm text-gray-400 mt-0.5">
                  <Clock size={14} className="mr-1" />
                  <span>{format(noteDate, 'MMM d, yyyy • h:mm a')}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge
                size="xs"
                colorType="light"
                color={category.color}
              >
                {category.name}
              </Badge>
              
              <Dropdown
                trigger={
                  <button
                    className="text-gray-400 hover:text-white p-1 rounded-full transition-colors"
                    aria-label="Note options"
                  >
                    <DotsThreeVertical size={18} />
                  </button>
                }
              >
                <Dropdown.Item 
                  onClick={() => onPin(note.id)}
                  icon={<PushPin size={18} weight={note.isPinned ? "fill" : "regular"} />}
                >
                  {note.isPinned ? 'Unpin Note' : 'Pin Note'}
                </Dropdown.Item>
                
                {/* Only show edit/delete if current user is the author */}
                {note.authorId === currentUserId && (
                  <>
                    <Dropdown.Item 
                      onClick={() => onEdit(note)}
                      icon={<PencilSimple size={18} />}
                    >
                      Edit Note
                    </Dropdown.Item>
                    
                    <Dropdown.Item 
                      onClick={() => onDelete(note.id)}
                      icon={<Trash size={18} />}
                      className="text-red-500 hover:text-red-400"
                    >
                      Delete Note
                    </Dropdown.Item>
                  </>
                )}
              </Dropdown>
            </div>
          </div>
          
          <div className="mt-4 text-white whitespace-pre-wrap">{note.content}</div>
        </div>
      </Card>
    </motion.div>
  );
};

// Note form modal
const NoteFormModal = ({ isOpen, onClose, note, onSubmit, isSubmitting, currentUserId }) => {
  const isEditing = !!note; // If note exists, we're editing
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      content: note?.content || '',
      category: note?.category || 'general',
    }
  });
  
  // Reset form when modal opens/closes or note changes
  useEffect(() => {
    if (isOpen) {
      reset({
        content: note?.content || '',
        category: note?.category || 'general',
      });
    }
  }, [isOpen, note, reset]);
  
  // Handle form submission
  const handleFormSubmit = (data) => {
    onSubmit({
      ...(isEditing ? { id: note.id } : {}),
      content: data.content,
      category: data.category,
      authorId: currentUserId,
    });
  };
  
  // Handle modal close
  const handleClose = () => {
    reset();
    onClose();
  };
  
  if (!isOpen) return null;
  
  return (
    <motion.div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="w-full max-w-lg bg-gray-800 rounded-lg shadow-xl overflow-hidden"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", duration: 0.5 }}
      >
        <div className="p-6">
          <h2 className="text-xl font-semibold text-white mb-6">
            {isEditing ? 'Edit Note' : 'Add Note'}
          </h2>
          
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Note Category
                </label>
                <select
                  className="w-full bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
                  {...register('category')}
                >
                  {noteCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">
                  Note Content <span className="text-red-500">*</span>
                </label>
                <textarea
                  className="w-full h-32 bg-gray-700 text-white rounded-md py-2 px-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Enter your note here..."
                  {...register('content')}
                ></textarea>
                {errors.content && (
                  <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
                )}
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <Button
                  variant="outline"
                  color="metal"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                
                <Button
                  type="submit"
                  color="primary"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 
                    'Saving...' : 
                    isEditing ? 'Update Note' : 'Add Note'
                  }
                </Button>
              </div>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Main component
export default function NotesTab({ ownerId }) {
  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Current user ID (in a real app, this would come from auth context)
  const currentUserId = 'current-user-id';
  
  // Fetch notes
  useEffect(() => {
    const fetchNotes = async () => {
      if (!ownerId) return;
      
      setIsLoading(true);
      setError('');
      
      try {
        // In a real app, this would be an API call
        // For now, use mock data
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const mockNotes = [
          {
            id: '1',
            content: 'Owner is requesting expedited verification due to upcoming permit deadline. Please prioritize document review.',
            category: 'important',
            authorId: 'current-user-id',
            authorName: 'Jane Smith',
            createdAt: new Date(2025, 4, 15, 14, 30).toISOString(),
            isPinned: true
          },
          {
            id: '2',
            content: 'Discussed verification requirements over phone call. Owner will provide additional address documentation by Friday.',
            category: 'verification',
            authorId: 'other-user-id',
            authorName: 'Alex Johnson',
            createdAt: new Date(2025, 4, 10, 9, 45).toISOString(),
            isPinned: false
          },
          {
            id: '3',
            content: 'Business name will be "Coastal Technologies LLC" - wants to start application as soon as verified.',
            category: 'business',
            authorId: 'current-user-id',
            authorName: 'Jane Smith',
            createdAt: new Date(2025, 4, 5, 11, 20).toISOString(),
            isPinned: false
          }
        ];
        
        setNotes(mockNotes);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError(err.message || 'Failed to load notes');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNotes();
  }, [ownerId]);
  
  // Filter notes based on category and search term
  useEffect(() => {
    let filtered = [...notes];
    
    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(note => note.category === filterCategory);
    }
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(note => 
        note.content.toLowerCase().includes(term) ||
        note.authorName.toLowerCase().includes(term) ||
        noteCategories.find(c => c.id === note.category)?.name.toLowerCase().includes(term)
      );
    }
    
    // Sort: pinned first, then by date (newest first)
    filtered.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    setFilteredNotes(filtered);
  }, [notes, filterCategory, searchTerm]);
  
  // Handle adding/editing a note
  const handleNoteSubmit = async (data) => {
    setIsSubmitting(true);
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      if (data.id) {
        // Editing existing note
        setNotes(prev => prev.map(note => 
          note.id === data.id ? {
            ...note,
            content: data.content,
            category: data.category,
            // Keep other properties like authorId, createdAt, etc.
          } : note
        ));
      } else {
        // Adding new note
        const newNote = {
          id: Date.now().toString(),
          content: data.content,
          category: data.category,
          authorId: data.authorId,
          authorName: 'Jane Smith', // In a real app, this would be the current user's name
          createdAt: new Date().toISOString(),
          isPinned: false
        };
        
        setNotes(prev => [newNote, ...prev]);
      }
      
      // Close modal and reset editing state
      setIsModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err.message || 'Failed to save note');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle pinning/unpinning a note
  const handlePinNote = async (noteId) => {
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setNotes(prev => prev.map(note => 
        note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
      ));
    } catch (err) {
      console.error('Error toggling pin status:', err);
      setError(err.message || 'Failed to update note');
    }
  };
  
  // Handle deleting a note
  const handleDeleteConfirm = async () => {
    if (!noteToDelete) return;
    
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNotes(prev => prev.filter(note => note.id !== noteToDelete));
      setShowDeleteModal(false);
      setNoteToDelete(null);
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.message || 'Failed to delete note');
    }
  };
  
  // Open modal for adding a new note
  const handleAddNote = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };
  
  // Open modal for editing a note
  const handleEditNote = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };
  
  // Open delete confirmation modal
  const handleDeleteNote = (noteId) => {
    setNoteToDelete(noteId);
    setShowDeleteModal(true);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.05 
      }
    }
  };
  
  // Loading state
  if (isLoading) {
    return <LoadingSkeleton type="notesList" rows={3} />;
  }
  
  // Empty state (no notes)
  if (notes.length === 0 && !error) {
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-text-primary">Notes</h2>
          
          <Button
            size="sm"
            type="button"
            onClick={handleAddNote}
          >
            <Plus size={18} className="mr-2" />
            Add Note
          </Button>
        </div>
        
        <EmptyState
          icon={<ClipboardText size={36} className="text-primary" weight="light" />}
          title="No Notes Yet"
          description="Add notes about this business owner to keep track of important information and share with your team."
          actionLabel="Add First Note"
          onAction={handleAddNote}
        />
        
        {/* Note form modal */}
        <AnimatePresence>
          {isModalOpen && (
            <NoteFormModal
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              note={editingNote}
              onSubmit={handleNoteSubmit}
              isSubmitting={isSubmitting}
              currentUserId={currentUserId}
            />
          )}
        </AnimatePresence>
      </div>
    );
  }
  
  // Error state
  if (error) {
    return (
      <div>
        <h2 className="text-xl font-semibold text-text-primary mb-6">Notes</h2>
        <ErrorMessage message={error} />
      </div>
    );
  }
  
  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-xl font-semibold text-text-primary">Notes ({filteredNotes.length})</h2>
        
        <div className="flex flex-wrap gap-2">
          {/* Search */}
          <Input
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-auto min-w-[200px]"
          />
          
          {/* Category filter dropdown */}
          <select
            className="bg-gray-700 text-white rounded-md py-1.5 px-3 text-sm border border-gray-600 focus:outline-none focus:ring-2 focus:ring-primary"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="all">All Categories</option>
            {noteCategories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          
          {/* Add note button */}
          <Button
            size="sm"
            type="button"
            onClick={handleAddNote}
          >
            <Plus size={18} className="mr-2" />
            Add Note
          </Button>
        </div>
      </div>
      
      {/* Notes list */}
      <div className="grid grid-cols-1 gap-4">
        {filteredNotes.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            No notes match your search or filter criteria.
          </div>
        ) : (
          filteredNotes.map(note => (
            <NoteCard
              key={note.id}
              note={note}
              onPin={handlePinNote}
              onEdit={handleEditNote}
              onDelete={handleDeleteNote}
              currentUserId={currentUserId}
            />
          ))
        )}
      </div>
      
      {/* Note form modal */}
      <AnimatePresence>
        {isModalOpen && (
          <NoteFormModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            note={editingNote}
            onSubmit={handleNoteSubmit}
            isSubmitting={isSubmitting}
            currentUserId={currentUserId}
          />
        )}
      </AnimatePresence>
      
      {/* Delete confirmation modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="w-full max-w-md bg-gray-800 rounded-lg shadow-xl overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <div className="p-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  Delete Note
                </h2>
                
                <p className="text-gray-300 mb-6">
                  Are you sure you want to delete this note? This action cannot be undone.
                </p>
                
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    color="metal"
                    onClick={() => {
                      setShowDeleteModal(false);
                      setNoteToDelete(null);
                    }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    color="danger"
                    onClick={handleDeleteConfirm}
                  >
                    Delete Note
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}