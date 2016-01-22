def get_probability_player_wins(score_1, score_2):
    '''
    score_1 represents the score of the player considered
    score_2 is the score of its enemy
    '''
    exponential_factor = (score_2 - score_1) / 400
    return 1 / (1 + 10 ** exponential_factor)


def get_k_factor(score):
    '''
    The K factor is a bit empiric but those values seems to work for me
    '''
    if score < 1000:
        return 80
    elif 1000 <= score < 2000:
        return 50
    elif 2000 <= score < 2400:
        return 30
    else:
        return 20


def compute_new_score_for_player(score_1, score_2, game_result):
    '''
    score_1 is the score of the player considered
    score_2 is the score of its enemy
    game_result: 1 if the players wins, 0 if he loses, 0.5 if equality
    '''
    k_factor = get_k_factor(score_1)
    probability_player_wins = get_probability_player_wins(score_1, score_2)
    new_score = round(score_1 + k_factor * (game_result - probability_player_wins))
    if new_score < 300:
        new_score = 300
    return int(new_score)


def get_new_scores(score_1, score_2, game_result_player):
    '''
    score_1 represents the score of the player considered
    score_2 represents the score of the enemy
    game_result: 1 if the players wins, 0 if he loses, 0.5 if equality
    '''
    game_result_enemy = 1 - game_result_player
    new_score_player1 = compute_new_score_for_player(score_1, score_2, game_result_player)
    new_score_player2 = compute_new_score_for_player(score_2, score_1, game_result_enemy)
    return [new_score_player1, new_score_player2]
