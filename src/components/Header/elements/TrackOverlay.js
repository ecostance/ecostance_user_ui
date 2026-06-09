import { useRouter } from 'next/router'
import { useState } from "react";
import { MdClose } from "react-icons/md";

const TrackOverlay = ({ activeStatus, getActiveStatus, placeholder }) => {
  const router = useRouter()
  const [searchText, setSearchText] = useState("");
  const handleSearch = (e) => {
	e.preventDefault()
	getActiveStatus(false);
	document.querySelector("body").classList.remove("overflow-hidden");
   	router.push(`/other/track/${searchText}`)
  };


	return (
		<div className={`search-overlay ${activeStatus ? 'active' : ''}`}>
			{/*=======  close icon  =======*/}
			<button
				className="search-overlay__close-icon"
				onClick={() => {
					getActiveStatus(false);
					document.querySelector('body').classList.remove('overflow-hidden');
				}}
			>
				<MdClose />
			</button>
			{/*=======  End of close icon  =======*/}
			{/*=======  search overlay content  =======*/}
			<div className="search-overlay__content">
				<form className="space-mb--20">
					{/* <input
						style={{ display: 'none' }}
						type="search"
						placeholder={placeholder}
					/> */}

					<input
						onKeyDown={(e) => e.keyCode === 13 && handleSearch(e)}
						onChange={(e) => setSearchText(e.target.value)}
						type="search"
						placeholder={placeholder}
					/>
				</form>
				<div className="search-overlay__hint">Hit enter to track</div>
			</div>
			{/*=======  End of search overlay content  =======*/}
		</div>
	);

};

export default TrackOverlay;
