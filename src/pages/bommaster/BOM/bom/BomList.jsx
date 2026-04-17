import React, { useState } from 'react';
import {
    Box,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    Button,
    TextField,
    InputAdornment,
    Tooltip,
    Typography,
    TablePagination,
    Checkbox,
    Stack,
    Chip,
    Avatar,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Divider,
    CircularProgress,
    Collapse,
} from '@mui/material';
import {
    Search as SearchIcon,
    Add as AddIcon,
    Delete as DeleteIcon,
    Visibility as ViewIcon,
    Edit as EditIcon,
    MoreVert as MoreVertIcon,
    Inventory as InventoryIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
    CheckCircle as CheckCircleIcon,
    Pending as PendingIcon,
    LocationSearching as WhereUsedIcon,
    ThumbUp as ApproveIcon,
    Star as DefaultIcon,
    PlayArrow as ValidateIcon,
    FileCopy as FileCopyIcon,
    Star as StarIcon
} from '@mui/icons-material';
import { COLORS, STATUS_COLORS } from '../constants';

// Action Menu Component for BOM (similar to BomRevisionMaster style)
const BomActionMenu = ({ item, anchorEl, onOpen, onClose, onView, onEdit, onDelete, onWhereUsed, onExplosion, onValidate, onCopy, onApprove, onSetDefault,
    permissions = { view: false, create: false, update: false, delete: false }
 }) => {
    const canApprove = item?.status === 'Pending' && permissions?.update;
    const canSetDefault = item?.status === 'Approved' && permissions?.update;
    const canView = permissions?.view;
    const canUpdate = permissions?.update;
    const canDelete = permissions?.delete;
    const canCreate = permissions?.create;
    return (
        <>
            <Tooltip title="Actions">
                <IconButton
                    size="small"
                    onClick={onOpen}
                    sx={{
                        color: COLORS.text.secondary,
                        '&:hover': {
                            bgcolor: `${COLORS.primary}20`
                        }
                    }}
                >
                    <MoreVertIcon fontSize="small" />
                </IconButton>
            </Tooltip>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={onClose}
                PaperProps={{
                    elevation: 3,
                    sx: {
                        mt: 1,
                        minWidth: 200,
                        borderRadius: 2,
                        border: `1px solid ${COLORS.border}`,
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }
                }}
            >
                {/* View Details - with safety check */}
                {canView && onView && (
                    <MenuItem onClick={() => { onView(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                            <ViewIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                                View Details
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
                 {/* Edit - with safety check */}
                {canUpdate && onEdit && (
                    <MenuItem onClick={() => { onEdit(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: COLORS.primary, minWidth: 36 }}>
                            <EditIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: COLORS.text.primary, fontSize: '0.75rem' }}>
                                Edit
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
                    {/* Where Used - with safety check */}
                {canView && onWhereUsed && (
                    <MenuItem onClick={() => { onWhereUsed(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#8B5CF6', minWidth: 36 }}>
                            <WhereUsedIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#8B5CF6', fontSize: '0.75rem' }}>
                                Where Used
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
                 {/* BOM Explosion - with safety check */}
                {canView && onExplosion && (
                    <MenuItem onClick={() => { onExplosion(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
                            <InventoryIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                                BOM Explosion
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
                 {/* Validate BOM - with safety check */}
                {canView && onValidate && (
                    <MenuItem onClick={() => { onValidate(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#3B82F6', minWidth: 36 }}>
                            <ValidateIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#3B82F6', fontSize: '0.75rem' }}>
                                Validate BOM
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
                  {/* Copy BOM - with safety check */}
                {canCreate && onCopy && (
                    <MenuItem onClick={() => { onCopy(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#3B82F6', minWidth: 36 }}>
                            <FileCopyIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#3B82F6', fontSize: '0.75rem' }}>
                                Copy BOM
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
                {/* Set as Default - Only for Approved status */}
                {canSetDefault && onSetDefault && (
                    <MenuItem onClick={() => { onSetDefault && onSetDefault(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#F59E0B', minWidth: 36 }}>
                            <StarIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#F59E0B', fontSize: '0.75rem' }}>
                                Set as Default
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
                  {/* Approve - Only for Pending status - with safety check */}
                {canApprove && onApprove && (
                    <MenuItem onClick={() => { onApprove(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#10B981', minWidth: 36 }}>
                            <ApproveIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} sx={{ color: '#10B981', fontSize: '0.75rem' }}>
                                Approve
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}
               
                 <Divider sx={{ my: 0.5, borderColor: COLORS.border }} />
                    {/* Delete - with safety check */}
                {canDelete && onDelete && (
                    <MenuItem onClick={() => { onDelete(item); onClose(); }} sx={{ py: 1.5 }}>
                        <ListItemIcon sx={{ color: '#EF4444', minWidth: 36 }}>
                            <DeleteIcon fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>
                            <Typography variant="body2" fontWeight={500} color="#EF4444" sx={{ fontSize: '0.75rem' }}>
                                Delete
                            </Typography>
                        </ListItemText>
                    </MenuItem>
                )}

            </Menu>
        </>
    );
};

// Expandable Row Component for Components List
// Fix the ExpandableRow component - add null/undefined checks
const ExpandableRow = ({ bom }) => {
    const [expanded, setExpanded] = useState(false);
    
    // Add safety check at the beginning
    if (!bom || !bom.components || bom.components.length === 0) return null;

    return (
        <>
            <TableRow>
                <TableCell colSpan={2}>
                    <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </TableCell>
                <TableCell colSpan={6}>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <Typography sx={{ fontSize: '0.75rem', fontWeight: 500 }}>{bom.components.length} Component(s)</Typography>
                        <Chip label={`Version: ${bom.bom_version}`} size="small" sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary }} />
                    </Stack>
                </TableCell>
            </TableRow>
            <TableRow>
                <TableCell colSpan={9} sx={{ pb: 0, pt: 0 }}>
                    <Collapse in={expanded}>
                        <Box sx={{ m: 2 }}>
                            <Typography variant="subtitle2" sx={{ fontSize: '0.7rem', fontWeight: 600, mb: 1 }}>Components List</Typography>
                            <Table size="small">
                                <TableHead>
                                    <TableRow sx={{ bgcolor: COLORS.background.light }}>
                                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Level</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Part No</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Description</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Qty Per</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Unit</TableCell>
                                        <TableCell sx={{ fontSize: '0.65rem', fontWeight: 600 }}>Scrap %</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {bom.components.map((comp, idx) => (
                                        <TableRow key={idx}>
                                            <TableCell sx={{ fontSize: '0.7rem' }}>{comp.level || idx + 1}</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem' }}>{comp.component_part_no || '-'}</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem' }}>{comp.component_desc || '-'}</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem' }}>{comp.quantity_per || 0}</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem' }}>{comp.unit || '-'}</TableCell>
                                            <TableCell sx={{ fontSize: '0.7rem' }}>{comp.scrap_percent || 0}%</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};

const getStatusIcon = (status) => {
    switch (status) {
        case 'Approved': return <CheckCircleIcon sx={{ fontSize: '0.7rem' }} />;
        case 'Pending': return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
        default: return <PendingIcon sx={{ fontSize: '0.7rem' }} />;
    }
};

const getBomInitials = (bom) => {
    if (!bom?.bom_id) return 'BM';
    return bom.bom_id.substring(0, 2).toUpperCase();
};

const getAvatarColor = (bom) => {
    if (!bom?.bom_id) return COLORS.primary;
    const colors = [COLORS.primary, COLORS.primaryDark, '#074346', '#0D696C', '#128C7E'];
    const charCode = bom.bom_id.charCodeAt(0) || 0;
    return colors[charCode % colors.length];
};

const BomList = ({
    boms = [],
    loading = false,
    searchInput = '',
    setSearchInput,
    page = 0,
    rowsPerPage = 10,
    totalItems = 0,
    handleChangePage,
    handleChangeRowsPerPage,
    selected = [],
    handleSelectAll,
    handleSelect,
    permissions = { view: false, create: false, update: false, delete: false },
    onAddBom,
    actions = {}
}) => {
        console.log('Actions received in BomList:', actions);
    console.log('onView exists?', !!actions.onView);
    console.log('onEdit exists?', !!actions.onEdit);
    console.log('onDelete exists?', !!actions.onDelete)
    const [actionMenuAnchor, setActionMenuAnchor] = useState(null);
    const [selectedBom, setSelectedBom] = useState(null);

    const handleMenuOpen = (event, bom) => {
        setActionMenuAnchor(event.currentTarget);
        setSelectedBom(bom);
    };

    const handleMenuClose = () => {
        setActionMenuAnchor(null);
        setSelectedBom(null);
    };

    const bomsArray = Array.isArray(boms) ? boms : [];
    const hasDeletePermission = permissions?.delete || false;

    return (
        <Paper sx={{ borderRadius: 2, overflow: 'hidden', border: `1px solid ${COLORS.border}` }}>
            {/* Search Bar */}
            <Box sx={{ p: 1.5, borderBottom: `1px solid ${COLORS.border}`, display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ flex: 1 }}>
                    <TextField
                        placeholder="Search by BOM ID, Parent Part No, or Version..."
                        size="small"
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        sx={{
                            width: { xs: '100%', sm: 360 },
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 1.5,
                                fontSize: '0.75rem',
                                '&:hover fieldset': {
                                    borderColor: COLORS.primary,
                                },
                            }
                        }}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon sx={{ fontSize: '1rem', color: COLORS.text.tertiary }} />
                                </InputAdornment>
                            ),
                            sx: {
                                height: 36,
                                bgcolor: COLORS.background.light,
                                '& input': {
                                    padding: '6px 12px',
                                    fontSize: '0.75rem',
                                    color: COLORS.text.primary,
                                    '&::placeholder': {
                                        color: COLORS.text.tertiary,
                                        fontSize: '0.75rem'
                                    }
                                }
                            }
                        }}
                        disabled={loading}
                    />
                </Stack>
                {permissions?.create && (
                    <Button 
                        variant="contained" 
                        startIcon={<AddIcon />} 
                        onClick={onAddBom} 
                        sx={{ height: 36, bgcolor: COLORS.primary, textTransform: 'none' }}
                    >
                        Add BOM
                    </Button>
                )}
            </Box>

            {/* BOMs Table */}
            <TableContainer sx={{ overflowX: 'auto' }}>
                <Table size="small" sx={{ minWidth: 800 }}>
                    <TableHead>
                        <TableRow sx={{ 
                            bgcolor: COLORS.background.tableHeader,
                            '& .MuiTableCell-root': {
                                borderBottom: 'none',
                                color: COLORS.text.light,
                                py: 1.5,
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                whiteSpace: 'nowrap'
                            }
                        }}>
                            {hasDeletePermission && <TableCell padding="checkbox" sx={{ width: 40 }}><Checkbox indeterminate={selected.length > 0 && selected.length < bomsArray.length} checked={bomsArray.length > 0 && selected.length === bomsArray.length} onChange={handleSelectAll} /></TableCell>}
                            <TableCell sx={{ minWidth: 180 }}>BOM ID / Parent Item</TableCell>
                            <TableCell sx={{ width: 100 }}>Version</TableCell>
                            <TableCell sx={{ width: 100 }}>Type</TableCell>
                            <TableCell sx={{ width: 110 }}>Status</TableCell>
                            <TableCell sx={{ width: 100 }} align="center">Components</TableCell>
                            <TableCell sx={{ width: 80 }} align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                    <CircularProgress size={32} sx={{ color: COLORS.primary }} />
                                    <Typography sx={{ fontSize: '0.75rem', color: COLORS.text.secondary, mt: 1 }}>
                                        Loading BOMs...
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : bomsArray.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} align="center" sx={{ py: 6 }}>
                                    <Box sx={{ textAlign: 'center' }}>
                                        <InventoryIcon sx={{ fontSize: 48, color: COLORS.text.tertiary, mb: 1 }} />
                                        <Typography variant="body1" sx={{ fontSize: '0.875rem', color: COLORS.text.secondary, fontWeight: 500 }}>
                                            {searchInput ? 'No BOMs found' : 'No BOMs available'}
                                        </Typography>
                                        <Typography variant="body2" sx={{ fontSize: '0.75rem', color: COLORS.text.tertiary, mt: 0.5 }}>
                                            {searchInput ? 'Try adjusting your search terms' : 'Add your first BOM to get started'}
                                        </Typography>
                                    </Box>
                                </TableCell>
                            </TableRow>
                        ) : (
                            bomsArray.map((bom) => {
                                if (!bom) return null;
                                const isSelected = selected.includes(bom._id);
                                const parentItem = bom.parent_item_id || {};
                                const statusColors = STATUS_COLORS?.[bom.status] || { bg: '#F1F5F9', color: '#475569' };
                                const componentsCount = bom.components?.length || 0;

                                return (
                                    <React.Fragment key={bom._id}>
                                        <TableRow 
                                            hover 
                                            selected={isSelected} 
                                            sx={{ 
                                                bgcolor: COLORS.background.white,
                                                '&:hover': { bgcolor: COLORS.background.hover },
                                                '&.Mui-selected': { bgcolor: `${COLORS.primary}10` },
                                                '& .MuiTableCell-root': { py: 1.5, fontSize: '0.75rem', borderColor: COLORS.border }
                                            }}
                                        >
                                            {hasDeletePermission && <TableCell padding="checkbox" sx={{ width: 40 }}><Checkbox checked={isSelected} onChange={() => handleSelect(bom._id)} /></TableCell>}

                                            <TableCell>
                                                <Stack direction="row" spacing={1.5} alignItems="center" sx={{ minWidth: 0 }}>
                                                    <Avatar sx={{ width: 32, height: 32, bgcolor: getAvatarColor(bom), fontSize: '0.7rem', flexShrink: 0 }}>
                                                        {getBomInitials(bom)}
                                                    </Avatar>
                                                    <Box sx={{ minWidth: 0 }}>
                                                        <Typography sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{bom.bom_id}</Typography>
                                                        <Typography sx={{ fontSize: '0.65rem', color: COLORS.text.tertiary, whiteSpace: 'nowrap' }}>
                                                            {parentItem.part_no || bom.parent_part_no}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </TableCell>

                                            <TableCell>
                                                <Chip 
                                                    label={bom.bom_version} 
                                                    size="small" 
                                                    sx={{ bgcolor: COLORS.primaryLight, color: COLORS.primary, fontWeight: 500, fontSize: '0.7rem' }} 
                                                />
                                            </TableCell>

                                            <TableCell>
                                                <Typography sx={{ fontSize: '0.75rem', whiteSpace: 'nowrap' }}>{bom.bom_type}</Typography>
                                            </TableCell>

                                            <TableCell>
                                                <Chip
                                                    icon={getStatusIcon(bom.status)}
                                                    label={bom.status || 'Pending'}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: statusColors.bg,
                                                        color: statusColors.color,
                                                        fontWeight: 500,
                                                        fontSize: '0.7rem',
                                                        '& .MuiChip-icon': { fontSize: '0.8rem' }
                                                    }}
                                                />
                                            </TableCell>

                                            <TableCell align="center">
                                                <Typography fontWeight={500} sx={{ whiteSpace: 'nowrap' }}>{componentsCount}</Typography>
                                            </TableCell>

                                            <TableCell align="center" sx={{ width: 80 }}>
                                                <BomActionMenu
                                                    item={bom}
                                                    anchorEl={actionMenuAnchor && selectedBom?._id === bom._id ? actionMenuAnchor : null}
                                                    onOpen={(e) => handleMenuOpen(e, bom)}
                                                    onClose={handleMenuClose}
                                                    onView={actions.onView}
                                                    onEdit={actions.onEdit}
                                                    onDelete={actions.onDelete}
                                                    onWhereUsed={actions.onWhereUsed}
                                                    onExplosion={actions.onExplosion}
                                                    onValidate={actions.onValidate}
                                                    onCopy={actions.onCopy}
                                                    onApprove={actions.onApprove}
                                                    onSetDefault={actions.onSetDefault}
                                                    permissions={permissions}
                                                />
                                            </TableCell>
                                        </TableRow>
                                        {bom && bom.components && bom.components.length > 0 && <ExpandableRow bom={bom} />}
                                    </React.Fragment>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Pagination */}
            {bomsArray.length > 0 && (
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={totalItems || 0}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    sx={{
                        borderTop: `1px solid ${COLORS.border}`,
                        '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
                            fontSize: '0.7rem',
                            color: COLORS.text.secondary
                        },
                        '& .MuiTablePagination-select': { fontSize: '0.7rem' },
                        '& .MuiTablePagination-actions button': { color: COLORS.primary }
                    }}
                />
            )}
        </Paper>
    );
};

export default BomList;