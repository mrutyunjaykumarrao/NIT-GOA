import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

test('renders NIT Goa homepage', () => {
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
  const welcomeElement = screen.getByText(/Welcome to NIT Goa/i);
  expect(welcomeElement).toBeTruthy();
});
