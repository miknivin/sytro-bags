const Rupee = ({ width, height , ...props }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 203.86 300"
      width={width||"14px"}
      height={height||"auto"}
      {...props}
    >
      <g id="Group_21638">
        <path
          fill="#010202"
          d="M135.76 28.35H185L203.86 0h-185L0 28.35h32.1c32.5 0 62.5 2.5 74.51 29.7H19L.15 86.39h110c0 20.4-16.9 51.65-72.8 51.65h-27v26.5L118.74 300H167L54.85 160c46.15-2.5 89.46-28.31 95.7-73.56H185l18.86-28.34h-53.8a62.85 62.85 0 0 0-14.3-29.75"
        />
      </g>
    </svg>
  );
};

export default Rupee;