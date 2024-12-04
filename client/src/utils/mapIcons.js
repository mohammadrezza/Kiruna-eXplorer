import designIcon from '../assets/map_icons/design_file.svg';
import informativeIcon from '../assets/map_icons/informative_file.svg';
import prescriptiveIcon from '../assets/map_icons/prescriptive_file.svg';
import technicalIcon from '../assets/map_icons/technical_file.svg';
import agreementIcon from '../assets/map_icons/agreement_icon.svg';
import conflictIcon from '../assets/map_icons/conflict_icon.svg';
import consultingIcon from '../assets/map_icons/consulting_icon.svg';
import materialEffectIcon from '../assets/map_icons/material_effect_icon.svg';
import defaultIcon from '../assets/map_icons/default.svg'

export const pointer = {
  name: 'default',
  iconUrl: defaultIcon,
  iconSize: [40, 40],
  iconAnchor: [20, 40],
};

export const iconData = [
  {
    name: 'Design',
    iconUrl: designIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  },
  {
    name: 'Informative',
    iconUrl: informativeIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  },
  {
    name: 'Prescriptive',
    iconUrl: prescriptiveIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  },
  {
    name: 'Technical',
    iconUrl: technicalIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  },
  {
    name: 'Agreement',
    iconUrl: agreementIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  },
  {
    name: 'Conflict',
    iconUrl: conflictIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  },
  {
    name: 'Consultation',
    iconUrl: consultingIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  },
  {
    name: 'Material Effect',
    iconUrl: materialEffectIcon,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  },
  pointer
];
