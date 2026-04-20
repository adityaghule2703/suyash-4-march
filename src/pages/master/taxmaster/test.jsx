import React from 'react'
import { ACTIONS, hasPermission, MODULES, PAGES } from '../../../utils/modulePermissions'
import { Tooltip } from 'chart.js';
import { Divider, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { COLORS } from '../leadsmaster/constants';
import { MoreVerticalIcon, ViewIcon } from 'lucide-react';

const test = () => {

  const ActionMenu = ({onView, onEdit, onDelete, onOpen, onClose, item, anchorEl, permissions}) =>{
    
    const canView = hasPermission(permissions,MODULES.TAX_MASTER, PAGES.TAX_CONFIGURATION, ACTIONS.VIEW);
    const canUpdate = hasPermission(permissions, MODULES.TAX_MASTER, PAGES.TAX_CONFIGURATION, ACTIONS.UPDATE);
    const canDelete = hasPermission(permissions, MODULES.TAX_MASTER, PAGES.TAX_CONFIGURATION, ACTIONS.DELETE);

    if(!canView && !canUpdate && !canDelete) {
      return null;
    }

    return (
      <>
         <Tooltip title="Actions">
            <IconButton 
              size='small'
              onClick={onOpen}
              sx={{
                color:COLORS.text.secondary,
                '&:hover': {
                  bgcolor: `${COLORS.primary}20`
                }
              }}
            >
               <MoreVerticalIcon />
            </IconButton>
         </Tooltip>
         <Menu 
           anchorEl={anchorEl}
           open={Boolean(anchorEl)}
           onClose={onClose}
           PaperProps={{
            mt:1
           }}
         >
          {canView && (
            <MenuItem
              onClick={()=>{
                onOpen(item)
                onClose()
              }}
            >
              <ListItemIcon>
                <ViewIcon></ViewIcon>
              </ListItemIcon>
              <ListItemText>
                View Details
              </ListItemText>
            
            </MenuItem>
          )}

          {canUpdate && (
            <MenuItem 
              onClick={()=>{
                onOpen(item)
                onClose()
              }}
            >
            <ListItemIcon>
              <ViewIcon></ViewIcon>
            </ListItemIcon>
            <ListItemText>
              Update Details
            </ListItemText>
            </MenuItem>
          )}

          {(canView || canUpdate) && canDelete && <Divider />}

          

         </Menu>
      </>
    )

  }

  return (
    <div>test</div>
  )
}

export default test