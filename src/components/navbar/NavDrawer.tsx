import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import "./NavBar.css";
import Accordion, { AccordionSlots } from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Fade from '@mui/material/Fade';
import { Link } from 'react-router-dom';

export default function NavDrawer() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const [mainExpanded, setMainExpanded] = React.useState(false);
  const [year1Expanded, set1Expanded] = React.useState(false);

  const handleMainExpansion = () => {
    setMainExpanded((prevExpanded) => !prevExpanded);
  };

  const handle1Expansion = () => {
    set1Expanded((prevExpanded) => !prevExpanded);
  };

  const DrawerList = (
    // <div className='accordion-body'>


    // </div>

    <Box sx={{ width: 250 }} role="presentation" >
      <List sx={{ padding: 0 }}>
        <Link className='drawer-item' to="/">
          <ListItem key="" disablePadding>
            <ListItemButton>

              <ListItemText className='drawer-text' primary="Home" />

            </ListItemButton>
          </ListItem>
        </Link>
      </List>
      <Accordion
        className='accordion-body'
        expanded={mainExpanded}
        onChange={handleMainExpansion}
        slots={{ transition: Fade as AccordionSlots['transition'] }}
        slotProps={{ transition: { timeout: 400 } }}
        sx={{
          boxShadow: 'none',
          height: mainExpanded ? 'auto' : '48px',
          marginTop: 0,
          ...[mainExpanded
            ? {
              '& .MuiAccordion-region': {
                height: 'auto',
              },
              '& .MuiAccordionDetails-root': {
                display: 'block',
              },
            }
            : {
              '& .MuiAccordion-region': {
                height: 0,
              },
              '& .MuiAccordionDetails-root': {
                display: 'none',
              },
            },
          ]
        }
        }
      >
        <AccordionSummary
          sx={{ margin: 0, height: '48px' }}
          expandIcon={mainExpanded ? <RemoveIcon /> : <AddIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          className='accordion-summary'

        >
          <Link className='drawer-item-narrow' to="/selected-works">
            <ListItemText className='drawer-text' primary="Selected Works" />
          </Link>

        </AccordionSummary>
        <AccordionDetails
          sx={{ paddingTop: 0, paddingBottom: 0 }}
        >
          <ListItem disablePadding>

          </ListItem>
          <Link className='drawer-item' to="/selected-works">
            <ListItem disablePadding>
              <ListItemButton>

                <ListItemText primary="Selected Works" />

              </ListItemButton>
            </ListItem>
          </Link>



        </AccordionDetails>
      </Accordion>
      <ListItem key="" disablePadding>
        <ListItemButton>
          <ListItemText primary="Home" />
        </ListItemButton>
      </ListItem>
    </Box>


    // {/* <List>
    // {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
    //   <ListItem key={text} disablePadding>
    //     <ListItemButton>
    //       <ListItemIcon>
    //         {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
    //       </ListItemIcon>
    //       <ListItemText primary={text} />
    //     </ListItemButton>
    //   </ListItem>
    // ))}
    // </List>
    // <Divider />
    // <List>
    // {['All mail', 'Trash', 'Spam'].map((text, index) => (
    //   <ListItem key={text} disablePadding>
    //     <ListItemButton>
    //       <ListItemIcon>
    //         {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
    //       </ListItemIcon>
    //       <ListItemText primary={text} />
    //     </ListItemButton>
    //   </ListItem>
    // ))}
    // </List> */}
  );

  return (
    <div>
      <Button onClick={toggleDrawer(true)}><div className='hamburger'>☰</div></Button>
      <Drawer open={open} anchor={'right'} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}