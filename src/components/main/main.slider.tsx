'use client'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import Button from "@mui/material/Button/Button";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from "next/link";

interface IProps{
    data: ITrackTop[];
    title: string
}

const MainSlider = (props: IProps) => {
    const {data,title} = props;
    const NextArrow = (props: any) => {
        return (
            <Button variant="contained" color="inherit" 
                onClick={props.onClick}
                sx={{
                    position: "absolute",
                    right: 45,
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,

                }}
            >
                <ChevronRightIcon />
            </Button>
        )
    }

    const PrevArrow = (props: any) => {
        return (
            <Button variant="contained" color="inherit"  onClick={props.onClick}
                sx={{
                    position: "absolute",
                    left: -12,
                    top: "25%",
                    zIndex: 2,
                    minWidth: 30,
                    width: 35,
                }}
            >
                <ChevronLeftIcon />
            </Button>
        )
    }

    const settings: Settings = {
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };
    //box === div
    return (

        <Box
            sx={{
                margin: "0 50px",
                ".track": {
                    padding: "0 0px"
                },
                ".track_img":{
                    width: "150px",
                    height: "150px"
                },
                "h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px",

                }
            }}
        >
            <h2> {title} </h2>

            <Slider {...settings}>
                {
                    data.map((e,index)=>(
                        <div className="track" key={e._id}>
                            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${e.imgUrl}`} alt="" className="track_img"/>
                            <Link href={`/track/${e._id}?audio=${e.trackUrl}&id=${e._id}`}>
                                <h4>{e.title}</h4>
                            </Link>
                            <h5>{`${e.category} ${index}`}</h5>
                        </div>
                    ))
                }
                
            </Slider>
            <Divider />
        </Box>

    );
}

export default MainSlider;