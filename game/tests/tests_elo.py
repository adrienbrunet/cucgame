from django.test import TestCase

from ..elo import (
    compute_new_score_for_player,
    get_k_factor,
    get_new_scores,
    get_probability_player_wins,
)


class TestElo(TestCase):
    def setUp(self):
        self.score_1 = 2400
        self.score_2 = 1700

    def test_probability_player_wins(self):
        p1 = get_probability_player_wins(self.score_1, self.score_2)
        p2 = get_probability_player_wins(self.score_2, self.score_1)
        assert p1 > p2

    def test_get_k_factor(self):
        assert get_k_factor(500) == 80
        assert get_k_factor(1500) == 50
        assert get_k_factor(2200) == 30
        assert get_k_factor(10000) == 20

    def test_compute_new_score_for_player(self):
        new_score = compute_new_score_for_player(self.score_2, self.score_1, 1)
        assert new_score > self.score_2

        new_score = compute_new_score_for_player(self.score_1, self.score_2, 0)
        assert new_score < self.score_1

    def test_compute_new_score_for_player_can_be_below_300(self):
        new_score = compute_new_score_for_player(300, 300, 0)
        assert new_score == 300

    def test_get_new_scores(self):
        s1, s2 = get_new_scores(self.score_2, self.score_1, 1)
        assert s1 > self.score_2
        assert s2 < self.score_1
