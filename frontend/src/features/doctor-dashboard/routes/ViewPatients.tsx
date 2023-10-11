import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { CardPlaceholder } from '@/components/CardPlaceholder';
import { viewPatients, searchByName, filterPatients } from '@/api/patient'; // Import your functions

import  { useState, useEffect } from 'react'; // Import React and useState
import {  MyPatientsResponseBase } from 'clinic-common/types/patient.types';


export function ViewPatients() {
  const { data: patients, isLoading } = useQuery(['view-patients'], viewPatients);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  //const [searchResults, setSearchResults] = useState<MyPatientsResponseBase[]>([]);

  // State for upcoming appointments filter
  const [upcomingAppointments, setUpcomingAppointments] = useState(false);

  // State for filtered patients
  const [filteredPatients, setFilteredPatients] = useState<MyPatientsResponseBase[]>(patients || []);

  const handleSearch = async () => {
    if (searchQuery) {
      const results = await searchByName(searchQuery);
      //setSearchResults(results);
      setFilteredPatients(results);
    }
  }

const handleFilter = async () => {
    // Call the filterPatients function with the list of patient IDs
    const patientIds = patients?.map((patient) => patient.id);
    if (patientIds) {
        const results = await filterPatients(patientIds);
        setFilteredPatients(results);
    }
};


useEffect(() => {
    if (upcomingAppointments) {
        handleFilter(); // Call the filter function when the checkbox is checked
    } else {
        // No filter, use the original patient data
        setFilteredPatients(patients || []); // Add a null check here
    }
}, [upcomingAppointments, handleFilter, patients, setFilteredPatients]);

  if (isLoading) {
    return <CardPlaceholder />;
  }

  return (
    <div>
      <input
        type="text"
        placeholder="Search by Name"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>

      <label>
        <input
          type="checkbox"
          checked={upcomingAppointments}
          onChange={(e) => setUpcomingAppointments(e.target.checked)}
        />
        Filter by Upcoming Appointments
      </label>

      <Grid container spacing={2}>
        {filteredPatients.map((patient) => (
          <Grid item xl={3} key={patient.id}>
            <Card variant="outlined">
              <CardContent>
                <Stack spacing={2}>
                  <Stack spacing={-1}>
                    <Typography variant="overline" color="text.secondary">
                      Name
                    </Typography>
                    <Typography variant="body1">{patient.name}</Typography>
                  </Stack>
                  <Stack spacing={-1}>
                    <Typography variant="overline" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body1">{patient.email}</Typography>
                  </Stack>
                  <Stack spacing={-1}>
                    <Typography variant="overline" color="text.secondary">
                      Phone Number
                    </Typography>
                    <Typography variant="body1">{patient.mobileNumber}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
