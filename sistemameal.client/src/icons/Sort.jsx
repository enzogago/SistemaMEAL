const Sort = ({type = 'all'}) => {
    let style1, style2;

    switch(type) {
        case 'asc':
            style1 = {
                fill: 'currentcolor',
                stroke: 'currentcolor',
                strokeWidth: '3',
                strokeMiterlimit: '10'
            };
            style2 = {
                fill: 'none',
                stroke: 'currentcolor',
                strokeWidth: '3',
                strokeMiterlimit: '10'
            };
            break;
        case 'desc':
            style1 = {
                fill: 'none',
                stroke: 'currentcolor',
                strokeWidth: '3',
                strokeMiterlimit: '10'
            };
            style2 = {
                fill: 'currentcolor',
                stroke: 'currentcolor',
                strokeWidth: '3',
                strokeMiterlimit: '10'
            };
            break;
        default:
            style1 = style2 = {
                fill: 'currentcolor',
                stroke: 'currentcolor',
                strokeWidth: '3',
                strokeMiterlimit: '10'
            };
    }

    return (
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" 
            viewBox="0 0 32 32" xmlSpace="preserve">
            <polygon 
                style={style1}
                points="16,3 24,14 8,14 "
            />
            <polygon
                style={style2}
                points="16,30 8,19 24,19 "
            />
        </svg>
    )
}

export default Sort;
