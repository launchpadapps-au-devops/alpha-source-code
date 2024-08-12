import React from 'react';
import { Switch, ListItem, ListItemText } from '@mui/material';

interface CategoryItemProps {
  name: string;
  published: boolean;
  onToggle: () => void;
}

const CategoryItem: React.FC<CategoryItemProps> = ({ name, published, onToggle }) => {
  return (
    <ListItem>
      <ListItemText primary={name} />
      <Switch checked={published} onChange={onToggle} />
    </ListItem>
  );
};

export default CategoryItem;
