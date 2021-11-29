export {}
// import arrowLeft from 'styles/sprites/topbarLeftarrow.svg';
// import times from 'styles/sprites/topbarClose.svg';

// import styles from './TopBarStyles.scss';

// export const handleBack = () => {
//     window.history.back();
// };

// const TopBar = ({
//   title,
//   type,
//   icon,
//   onClick,
//   extraStyle,
// }: {
//   title: string,
//   type?: string,
//   icon?: any,
//   onClick?: () => void,
//   extraStyle?: string,
// }) => {
//   if (type === 'back') {
//     icon = arrowLeft;
//     onClick = handleBack;
//   } else if (type === 'close') {
//     icon = times;
//     onClick = handleClose;
//   }

//   return (
//     <div class={classNames([extraStyle, styles.root])}>
//       <div class={classNames([extraStyle, styles.topBar])}>
//         <svg
//           onClick={onClick}
//           className={classNames([extraStyle, styles.icon])}
//         >
//           <use href={`#${icon.id}`} />
//         </svg>
//         {title}
//       </div>
//     </div>
//   );
// };

// TopBar.propTypes = {
//   title: PropTypes.string.isRequired,
//   type: PropTypes.oneOf(['back', 'close']),
//   icon: PropTypes.string,
//   onClick: PropTypes.func,
//   extraStyle: PropTypes.string,
// };

// TopBar.defaultProps = {
//   type: null,
//   icon: null,
//   onClick: null,
//   extraStyle: null,
// };

// export default TopBar;
