import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GitHubIcon from '../components/GitHubIcon';

describe('GitHubIcon', () => {
  it('renders correctly when visible', () => {
    render(<GitHubIcon isVisible={true} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('handles click events', () => {
    render(<GitHubIcon isVisible={true} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('handles keyboard events', () => {
    render(<GitHubIcon isVisible={true} />);
    const button = screen.getByRole('button');
    fireEvent.keyDown(button, { key: 'Enter' });
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('closes on backdrop click', () => {
    render(<GitHubIcon isVisible={true} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    const backdrop = screen.getByRole('dialog').parentElement?.querySelector('[aria-hidden="true"]');
    expect(backdrop).toBeInTheDocument();
    if (backdrop) {
      fireEvent.click(backdrop);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    }
  });

  it('closes on ESC key', () => {
    render(<GitHubIcon isVisible={true} />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    fireEvent.keyDown(button, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
}); 