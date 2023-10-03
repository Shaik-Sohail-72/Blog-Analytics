import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import axios from 'axios';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function BlogStats2() {
  const [blogStats, setBlogStats] = useState({
    totalBlogs: 0,
    longestTitle: '',
    privacyBlogsCount: 0,
  });

  useEffect(() => {
    axios.get('http://localhost:5000/api/blog-stats')
      .then((response) => {
        setBlogStats(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div className="container-fluid" style={{ display: 'flex', justifyContent: 'center' }}>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell align='center'>Total Number of blogs</StyledTableCell>
              <StyledTableCell align="center">Longest Title</StyledTableCell>
              <StyledTableCell align="center">Privacy Count</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <StyledTableRow key={1}>
              <StyledTableCell align='center'>
                {blogStats.totalBlogs}
              </StyledTableCell>
              <StyledTableCell align="center">{blogStats.longestTitle}</StyledTableCell>
              <StyledTableCell align="center">{blogStats.privacyBlogsCount}</StyledTableCell>
            </StyledTableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default BlogStats2;
