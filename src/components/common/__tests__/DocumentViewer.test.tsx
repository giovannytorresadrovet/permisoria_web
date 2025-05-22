import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DocumentViewer from '../../owners/verification-wizard/shared/DocumentViewer';

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} alt={props.alt} style={{ ...props.style }} />;
  },
}));

// Mock Phosphor icons
jest.mock('phosphor-react', () => ({
  MagnifyingGlassPlus: () => <span data-testid="zoom-in-icon" />,
  MagnifyingGlassMinus: () => <span data-testid="zoom-out-icon" />,
  ArrowsClockwise: () => <span data-testid="rotate-icon" />,
  DownloadSimple: () => <span data-testid="download-icon" />,
  FileText: () => <span data-testid="file-text-icon" />,
  FilePdf: () => <span data-testid="file-pdf-icon" />,
  ImageSquare: () => <span data-testid="image-icon" />,
  X: () => <span data-testid="close-icon" />,
  Warning: () => <span data-testid="warning-icon" />
}));

// Mock Button component from keep-react
jest.mock('keep-react', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} data-testid={props['data-testid'] || 'keep-button'} {...props}>
      {children}
    </button>
  )
}));

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => (
      <div {...props}>{children}</div>
    )
  }
}));

describe('DocumentViewer Component', () => {
  const mockDocumentUrl = 'https://example.com/document.pdf';
  const mockFileName = 'test-document.pdf';
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders PDF viewer correctly', () => {
    render(
      <DocumentViewer
        documentUrl={mockDocumentUrl}
        documentType="pdf"
        fileName={mockFileName}
        onClose={mockOnClose}
      />
    );

    // Check for PDF viewer elements
    expect(screen.getByText(mockFileName)).toBeInTheDocument();
    expect(screen.getByTestId('file-pdf-icon')).toBeInTheDocument();
    const pdfObject = document.querySelector('object');
    expect(pdfObject).toHaveAttribute('data', mockDocumentUrl);
    expect(pdfObject).toHaveAttribute('type', 'application/pdf');
  });

  it('renders image viewer correctly', () => {
    render(
      <DocumentViewer
        documentUrl="https://example.com/image.jpg"
        documentType="image"
        fileName="test-image.jpg"
        onClose={mockOnClose}
      />
    );

    // Check for image elements
    expect(screen.getByText('test-image.jpg')).toBeInTheDocument();
    expect(screen.getByTestId('image-icon')).toBeInTheDocument();
  });

  it('renders unknown file type correctly', () => {
    render(
      <DocumentViewer
        documentUrl="https://example.com/unknown.xyz"
        documentType="unknown"
        fileName="unknown-file.xyz"
        onClose={mockOnClose}
      />
    );

    // Check for unknown file type message
    expect(screen.getByText('unknown-file.xyz')).toBeInTheDocument();
    expect(screen.getByText('Unsupported file type')).toBeInTheDocument();
    expect(screen.getByText('Please download this file to view it')).toBeInTheDocument();
  });

  it('correctly displays zoom percentage', () => {
    const { container } = render(
      <DocumentViewer
        documentUrl={mockDocumentUrl}
        documentType="pdf"
        fileName={mockFileName}
      />
    );

    // Find the zoom percentage text directly
    const zoomText = screen.getByText('100%');
    expect(zoomText).toBeInTheDocument();
    
    // Find all buttons in the container
    const buttons = container.querySelectorAll('button');
    
    // Find zoom in button (button with zoom-in-icon)
    const zoomInButton = Array.from(buttons).find(button => 
      button.innerHTML.includes('data-testid="zoom-in-icon"')
    );
    
    // Find zoom out button (button with zoom-out-icon)
    const zoomOutButton = Array.from(buttons).find(button => 
      button.innerHTML.includes('data-testid="zoom-out-icon"')
    );
    
    // Zoom in
    if (zoomInButton) {
      fireEvent.click(zoomInButton);
      expect(screen.getByText('125%')).toBeInTheDocument();
    }
    
    // Zoom out twice to go below 100%
    if (zoomOutButton) {
      fireEvent.click(zoomOutButton);
      fireEvent.click(zoomOutButton);
      expect(screen.getByText('75%')).toBeInTheDocument();
    }
  });

  it('calls onClose when close button is clicked in fullscreen mode', () => {
    const { container } = render(
      <DocumentViewer
        documentUrl={mockDocumentUrl}
        documentType="pdf"
        fileName={mockFileName}
        onClose={mockOnClose}
        isFullScreen={true}
      />
    );

    // Find the close button by the icon
    const closeButton = Array.from(container.querySelectorAll('button')).find(button => 
      button.innerHTML.includes('data-testid="close-icon"')
    );
    
    // Click close button
    if (closeButton) {
      fireEvent.click(closeButton);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    }
  });

  it('applies the correct CSS classes for fullscreen mode', () => {
    const { container, rerender } = render(
      <DocumentViewer
        documentUrl={mockDocumentUrl}
        documentType="pdf"
        fileName={mockFileName}
        isFullScreen={false}
      />
    );

    // Without fullscreen, it should have specific classes
    const viewer = container.firstChild as HTMLElement;
    expect(viewer.className).toContain('relative');
    expect(viewer.className).toContain('rounded-lg');
    expect(viewer.className).not.toContain('fixed');

    // Rerender with fullscreen=true
    rerender(
      <DocumentViewer
        documentUrl={mockDocumentUrl}
        documentType="pdf"
        fileName={mockFileName}
        isFullScreen={true}
      />
    );

    // With fullscreen, it should have fixed position class
    const fullscreenViewer = container.firstChild as HTMLElement;
    expect(fullscreenViewer.className).toContain('fixed');
    expect(fullscreenViewer.className).toContain('inset-0');
    expect(fullscreenViewer.className).toContain('z-50');
  });
}); 