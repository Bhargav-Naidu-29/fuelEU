import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { RoutesFilters } from '@/adapters/ui/components/routes/RoutesFilters';

describe('RoutesFilters', () => {
  it('calls onFilterChange when changing vessel type, ship, and year', async () => {
    const user = userEvent.setup();
    const onFilterChange = vi.fn();

    render(<RoutesFilters onFilterChange={onFilterChange} />);

    const vesselSelect = screen.getByLabelText(/Vessel Type/i);
    const shipInput = screen.getByLabelText(/Search Ship/i);
    const yearSelect = screen.getByLabelText(/Year/i);

    // Change vessel type
    await user.selectOptions(vesselSelect, 'CONTAINER');
    expect(onFilterChange).toHaveBeenCalledWith({ vesselType: 'CONTAINER', shipId: '', year: new Date().getFullYear() });

    // Change ship id
    await user.clear(shipInput);
    await user.type(shipInput, 'R001');
    expect(onFilterChange).toHaveBeenCalledWith({ vesselType: 'CONTAINER', shipId: 'R001', year: new Date().getFullYear() });

    // Change year
    const currentYear = new Date().getFullYear();
    const targetYear = currentYear - 1; // ensure it exists in the list
    await user.selectOptions(yearSelect, String(targetYear));
    expect(onFilterChange).toHaveBeenCalledWith({ vesselType: 'CONTAINER', shipId: 'R001', year: targetYear });
  });
});