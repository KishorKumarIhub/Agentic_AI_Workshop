def generate_score(trend, volume, vc_list, compare_score):
    trend_weight = 0.3
    volume_weight = 0.2
    vc_weight = 0.3
    comp_weight = 0.2
    
    index = (len(trend)*trend_weight + volume/2000*volume_weight + len(vc_list)*vc_weight + (5-compare_score)*comp_weight)
    return round(index * 25, 2)